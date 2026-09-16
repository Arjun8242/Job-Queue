import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JobStatus } from '../job-status';

const TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  [JobStatus.PENDING]: [JobStatus.RUNNING],
  [JobStatus.RUNNING]: [JobStatus.COMPLETED, JobStatus.FAILED],
  [JobStatus.COMPLETED]: [],
  [JobStatus.FAILED]: [],
};

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        title: createJobDto.title,
        type: createJobDto.type,
        status: JobStatus.PENDING,
      },
    });
  }

  async findAll(status?: string) {
    if (status) {
      return this.prisma.job.findMany({ where: { status } });
    }
    return this.prisma.job.findMany();
  }

  async remove(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    await this.prisma.job.delete({ where: { id } });
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    const currentStatus = job.status as JobStatus;
    const newStatus = updateStatusDto.status;

    // Check if transition is allowed
    const allowedTransitions = TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new ConflictException(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }

    // Optimistic locking using updateMany to catch race conditions
    const updateResult = await this.prisma.job.updateMany({
      where: {
        id: id,
        version: job.version,
      },
      data: {
        status: newStatus,
        version: {
          increment: 1,
        },
      },
    });

    // If count is 0, it means the row was updated by another request since we loaded it
    if (updateResult.count === 0) {
      throw new ConflictException('Job was modified by another request, please refresh');
    }

    // Fetch and return the updated job
    return this.prisma.job.findUnique({ where: { id } });
  }
}
