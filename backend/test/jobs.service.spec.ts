import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from '../src/jobs/jobs.service';
import { PrismaService } from '../src/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JobStatus } from '../src/job-status';

describe('JobsService', () => {
  let service: JobsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: {
            job: {
              findUnique: jest.fn(),
              create: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should throw ConflictException on illegal status transition (e.g. pending to completed)', async () => {
    // Setup a pending job
    (prisma.job.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Test',
      type: 'test',
      status: JobStatus.PENDING,
      version: 0,
    });

    // Attempt illegal transition
    await expect(
      service.updateStatus('1', { status: JobStatus.COMPLETED }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException (race condition) when updateMany returns 0 count', async () => {
    // Setup a running job
    (prisma.job.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      title: 'Test',
      type: 'test',
      status: JobStatus.RUNNING,
      version: 1, // Let's pretend version is 1 when we read it
    });

    // Mock updateMany to return count: 0 (meaning another request already bumped the version)
    (prisma.job.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

    // Try to transition running -> completed
    await expect(
      service.updateStatus('1', { status: JobStatus.COMPLETED }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if job does not exist on updateStatus', async () => {
    (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.updateStatus('fake-id', { status: JobStatus.RUNNING }),
    ).rejects.toThrow(NotFoundException);
  });
});
