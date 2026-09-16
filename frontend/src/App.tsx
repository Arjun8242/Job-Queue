import { useEffect, useState, useCallback } from 'react';
import { api } from './api';
import type { Job } from './types';
import { ErrorBanner } from './components/ErrorBanner';
import { LoadingSpinner } from './components/LoadingSpinner';
import { JobForm } from './components/JobForm';
import { StatusFilter } from './components/StatusFilter';
import { StatusCounts } from './components/StatusCounts';
import { JobList } from './components/JobList';
import { Activity } from 'lucide-react';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getJobs(filter);
      setJobs(data);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <div className="p-2 bg-gray-900 text-white rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Job Queue Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor background task transitions</p>
          </div>
        </header>

        {/* Error Banner */}
        <ErrorBanner message={error} onClear={() => setError(null)} />

        {/* Top Controls */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Create New Job</h2>
          <JobForm onSuccess={fetchJobs} onError={setError} />
        </section>

        {/* Dashboard Stats */}
        <section>
          <StatusCounts jobs={jobs} />
        </section>

        {/* Job List area */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Job List</h2>
            <StatusFilter currentFilter={filter} onFilterChange={setFilter} />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <JobList jobs={jobs} onUpdate={fetchJobs} onError={setError} />
          )}
        </section>

      </div>
    </div>
  );
}

export default App;
