import React, { useState } from 'react';
import { type Job, type JobStatus, TRANSITIONS } from '../types';
import { api } from '../api';
import { Play, CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface JobRowProps {
  job: Job;
  onUpdate: () => void;
  onError: (msg: string) => void;
}

export const JobRow: React.FC<JobRowProps> = ({ job, onUpdate, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: JobStatus) => {
    setLoading(true);
    try {
      await api.updateStatus(job.id, { status: newStatus });
      onUpdate();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update job status';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete job "${job.title}"?`)) return;
    
    setLoading(true);
    try {
      await api.deleteJob(job.id);
      onUpdate();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete job';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const allowedTransitions = TRANSITIONS[job.status] || [];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {job.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {job.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(job.status)}`}>
          {job.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(job.createdAt).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          {/* Conditional Action Buttons based on valid transitions */}
          {allowedTransitions.includes('running') && (
            <button
              onClick={() => handleStatusChange('running')}
              disabled={loading}
              title="Start Job"
              className="text-blue-500 hover:text-blue-700 disabled:opacity-50 transition-colors p-1"
            >
              <Play size={18} />
            </button>
          )}
          
          {allowedTransitions.includes('completed') && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
              title="Complete Job"
              className="text-green-500 hover:text-green-700 disabled:opacity-50 transition-colors p-1"
            >
              <CheckCircle size={18} />
            </button>
          )}
          
          {allowedTransitions.includes('failed') && (
            <button
              onClick={() => handleStatusChange('failed')}
              disabled={loading}
              title="Fail Job"
              className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors p-1"
            >
              <XCircle size={18} />
            </button>
          )}

          <div className="w-px h-4 bg-gray-200 mx-1"></div>

          <button
            onClick={handleDelete}
            disabled={loading}
            title="Delete Job"
            className="text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors p-1"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
