import type { Job, CreateJobDto, UpdateStatusDto } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function fetchWrapper<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Not JSON
    }
    throw new ApiError(res.status, errorMsg);
  }

  // 204 No Content for DELETE
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  getJobs: (status?: string) => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return fetchWrapper<Job[]>(`/jobs${query}`);
  },
  createJob: (data: CreateJobDto) => {
    return fetchWrapper<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  deleteJob: (id: string) => {
    return fetchWrapper<void>(`/jobs/${id}`, { method: 'DELETE' });
  },
  updateStatus: (id: string, data: UpdateStatusDto) => {
    return fetchWrapper<Job>(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
