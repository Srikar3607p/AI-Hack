import React from 'react';

export const PriorityMeter = ({ score = 50, priority = 'Medium', factors = null }) => {
  const getProgressColor = (val) => {
    if (val >= 81) return 'bg-rose-600';
    if (val >= 61) return 'bg-amber-500';
    if (val >= 31) return 'bg-civic-500';
    return 'bg-slate-400';
  };

  return (
    <div className="space-y-3">
      {/* Overall Score Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-slate-600 dark:text-slate-400">Total Calculated Score</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">{score}/100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getProgressColor(score)}`}
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>
      </div>

      {/* 4-Factor Breakdown */}
      {factors && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Impact (40%)</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{Math.round(factors.impact || 50)}%</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Urgency (35%)</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{Math.round(factors.urgency || 50)}%</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Citizens (15%)</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{Math.round(factors.affectedCitizens || 50)}%</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Duration (10%)</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{Math.round(factors.duration || 20)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
