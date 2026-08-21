import React from 'react';

export const Skeleton = ({ className = '', lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse ${
              i === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse ${className}`}
    />
  );
};

export const SkeletonCard = () => (
  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-2.5 w-3/4" />
      </div>
    </div>
    <Skeleton lines={3} />
  </div>
);
