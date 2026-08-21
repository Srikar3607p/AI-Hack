import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  User,
  ShieldAlert
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export const ComplaintTimeline = ({ timeline = [], className = '' }) => {
  if (!timeline || timeline.length === 0) return null;

  const getActionIcon = (action, status) => {
    if (status === 'Resolved') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'Escalated') return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    if (action === 'COMPLAINT_REOPENED') return <RotateCcw className="w-4 h-4 text-amber-500" />;
    if (action === 'AI_INTAKE_ANALYSIS' || action === 'AI_DECISION') return <Sparkles className="w-4 h-4 text-civic-500" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Clock className="w-4 h-4 text-civic-600" />
        Case Lifecycle & Audit Timeline
      </h4>

      <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
        {timeline.map((event, idx) => (
          <div key={event._id || idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
              {getActionIcon(event.action, event.status)}
            </div>

            {/* Event Content */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 transition-all hover:border-civic-300 dark:hover:border-civic-700">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={event.status} />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {event.changedByName || 'System Agent'}
                  </span>
                  {event.changedByRole && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">
                      ({event.changedByRole})
                    </span>
                  )}
                </div>
                <time className="text-[11px] text-slate-400 dark:text-slate-500">
                  {new Date(event.timestamp).toLocaleString()}
                </time>
              </div>

              {event.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {event.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
