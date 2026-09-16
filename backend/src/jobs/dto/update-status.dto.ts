import { IsEnum } from 'class-validator';
import { JobStatus } from '../../job-status.js';

export class UpdateStatusDto {
  @IsEnum(JobStatus)
  status: JobStatus;
}
