export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Job {
  id: string;
  title: string;
  type: string;
  status: JobStatus;
  createdAt: string;
  version: number;
}

export interface CreateJobDto {
  title: string;
  type: string;
}

export interface UpdateStatusDto {
  status: JobStatus;
}

export const TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  pending: ['running'],
  running: ['completed', 'failed'],
  completed: [],
  failed: [],
};
