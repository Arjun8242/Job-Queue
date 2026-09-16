import React from 'react';
import type { Job, JobStatus } from '../types';

interface StatusCountsProps {
  jobs: Job[];
}

export const StatusCounts: React.FC<StatusCountsProps> = ({ jobs }) => {
  const counts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

  const total = jobs.length;

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white border border-gray-200 rounded-md mb-8">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
        <span className="text-xl font-semibold text-gray-900">{total}</span>
      </div>
      <div className="w-px bg-gray-200 hidden sm:block"></div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending</span>
        <span className="text-xl font-semibold text-amber-600">{counts['pending'] || 0}</span>
      </div>
      <div className="w-px bg-gray-200 hidden sm:block"></div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Running</span>
        <span className="text-xl font-semibold text-blue-600">{counts['running'] || 0}</span>
      </div>
      <div className="w-px bg-gray-200 hidden sm:block"></div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Completed</span>
        <span className="text-xl font-semibold text-green-600">{counts['completed'] || 0}</span>
      </div>
      <div className="w-px bg-gray-200 hidden sm:block"></div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Failed</span>
        <span className="text-xl font-semibold text-red-600">{counts['failed'] || 0}</span>
      </div>
    </div>
  );
};
