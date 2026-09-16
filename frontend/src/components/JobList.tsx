import React from 'react';
import type { Job } from '../types';
import { JobRow } from './JobRow';

interface JobListProps {
  jobs: Job[];
  onUpdate: () => void;
  onError: (msg: string) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onUpdate, onError }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-md">
        <p className="text-sm text-gray-500">No jobs found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <JobRow 
                key={job.id} 
                job={job} 
                onUpdate={onUpdate} 
                onError={onError} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
