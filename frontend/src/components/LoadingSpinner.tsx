import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
};
