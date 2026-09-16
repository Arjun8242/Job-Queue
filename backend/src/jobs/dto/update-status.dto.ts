import { IsEnum } from 'class-validator';
import { JobStatus } from '../../job-status';

export class UpdateStatusDto {
  @IsEnum(JobStatus)
  status: JobStatus;
}
