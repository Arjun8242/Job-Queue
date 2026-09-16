import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string | null;
  onClear: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClear }) => {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-center justify-between p-4 bg-red-50 border border-red-200 text-red-700 rounded-md shadow-sm">
      <div className="flex items-center gap-3">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClear} className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">
        Dismiss
      </button>
    </div>
  );
};
