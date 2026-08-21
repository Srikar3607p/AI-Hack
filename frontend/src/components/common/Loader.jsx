import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const Loader = ({ message = 'Loading civic data...', size = 'md', isAi = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <Loader2 className={`animate-spin text-civic-600 dark:text-civic-400 ${size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-5 h-5' : 'w-8 h-8'}`} />
        {isAi && (
          <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
        )}
      </div>
      {message && (
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
  );
};
