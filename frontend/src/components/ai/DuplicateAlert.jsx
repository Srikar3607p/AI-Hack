import React from 'react';
import { Copy, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DuplicateAlert = ({ duplicateInfo, currentRole = 'CITIZEN' }) => {
  if (!duplicateInfo || !duplicateInfo.isDuplicate) return null;

  return (
    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
          <Copy className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              AI Duplicate Intelligence Flag
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              {Math.round((duplicateInfo.similarityScore || 0.85) * 100)}% Similarity
            </span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
            {duplicateInfo.explanation || 'This complaint matches an active civic report in the same geographic radius.'}
          </p>

          {duplicateInfo.relatedComplaintId && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                Linked Master Case:
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800">
                {duplicateInfo.relatedComplaintId}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
