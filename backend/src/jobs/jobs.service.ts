import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JobStatus } from '../job-status';

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
    
    return this.prisma.job.update({
      where: { id },
      data: { status: updateStatusDto.status },
    });
  }
}
