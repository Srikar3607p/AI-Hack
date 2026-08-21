import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-civic-50 dark:bg-civic-950/60 text-civic-700 dark:text-civic-300 border border-civic-200 dark:border-civic-800',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    critical: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800 font-semibold animate-pulse',
    info: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  switch (priority) {
    case 'Critical':
      return <Badge variant="critical">Critical</Badge>;
    case 'High':
      return <Badge variant="danger">High Priority</Badge>;
    case 'Medium':
      return <Badge variant="warning">Medium</Badge>;
    case 'Low':
      return <Badge variant="default">Low</Badge>;
    default:
      return <Badge variant="default">{priority || 'Normal'}</Badge>;
  }
};

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Submitted':
      return <Badge variant="info">Submitted</Badge>;
    case 'AI Processing':
      return <Badge variant="purple">AI Processing</Badge>;
    case 'Assigned':
      return <Badge variant="primary">Assigned</Badge>;
    case 'Acknowledged':
      return <Badge variant="info">Acknowledged</Badge>;
    case 'In Progress':
      return <Badge variant="warning">In Progress</Badge>;
    case 'Escalated':
      return <Badge variant="critical">Escalated</Badge>;
    case 'Resolved':
      return <Badge variant="success">Resolved</Badge>;
    case 'Closed':
      return <Badge variant="default">Closed</Badge>;
    case 'Rejected':
      return <Badge variant="danger">Rejected</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};
