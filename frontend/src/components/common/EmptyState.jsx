import React from 'react';
import { Inbox, FileText } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No civic records found',
  description = 'You are all caught up. No active items in this view.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 ${className}`}>
      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-4 text-slate-400 dark:text-slate-500">
        <Icon className="w-8 h-8 text-civic-500" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
