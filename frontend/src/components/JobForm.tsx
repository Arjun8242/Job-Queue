import React, { useState } from 'react';
import { api } from '../api';
import { Plus } from 'lucide-react';

interface JobFormProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSuccess, onError }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type.trim()) return;

    setLoading(true);
    try {
      await api.createJob({ title, type });
      setTitle('');
      setType('');
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create job';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm transition-all"
        required
      />
      <input
        type="text"
        placeholder="Job Type (e.g. email, report)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm transition-all"
        required
      />
      <button
        type="submit"
        disabled={loading || !title.trim() || !type.trim()}
        className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
      >
        <Plus size={16} />
        Create Job
      </button>
    </form>
  );
};
