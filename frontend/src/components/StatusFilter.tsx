import React from 'react';

interface StatusFilterProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ currentFilter, onFilterChange }) => {
  const filters: { label: string; value: string }[] = [
    { label: 'All Jobs', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Running', value: 'running' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            currentFilter === f.value
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};
