import React from 'react';
import { Sparkles, Brain, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { AIAssistantBadge } from './AIAssistantBadge';
import { PriorityMeter } from './PriorityMeter';
import { Badge } from '../common/Badge';

export const AIExplanationCard = ({
  aiAnalysis,
  priority,
  priorityScore,
  priorityFactors,
  priorityExplanation,
  departmentName,
  assignedTeamName,
  category,
  issueType,
  className = ''
}) => {
  if (!aiAnalysis && !priorityExplanation) return null;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-civic-50/40 dark:from-slate-900/90 dark:to-civic-950/40 border border-civic-100 dark:border-civic-900/60 shadow-sm ${className}`}>
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-civic-600 text-white shadow-xs">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              AI Decision Intelligence
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Explainable classification, prioritization, and routing breakdown
            </p>
          </div>
        </div>
        <AIAssistantBadge
          analysisType={aiAnalysis?.analysisType}
          isAiAssisted={aiAnalysis?.isAiAssisted}
        />
      </div>

      {/* AI Summary */}
      {aiAnalysis?.summary && (
        <div className="mt-4 p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-civic-600 dark:text-civic-400">
            Intelligent Case Summary
          </span>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
            "{aiAnalysis.summary}"
          </p>
        </div>
      )}

      {/* Categorization & Routing Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
        {/* Category & Issue */}
        <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Categorization & Risk
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{category}</span>
            <Badge variant="primary" size="sm">{issueType || 'Civic Grievance'}</Badge>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Safety Risk: <strong className={aiAnalysis?.safetyRisk === 'High' ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}>{aiAnalysis?.safetyRisk || 'Low'}</strong> (Confidence: {Math.round((aiAnalysis?.confidenceScore || 0.88) * 100)}%)
          </p>
        </div>

        {/* Department Routing */}
        <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recommended Routing
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
            <span>{departmentName || 'Responsible Department'}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-civic-600 dark:text-civic-400 truncate">{assignedTeamName || 'Field Team'}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Dispatched automatically based on municipal category competency.
          </p>
        </div>
      </div>

      {/* 4-Factor Priority Breakdown */}
      <div className="mt-4 p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Explainable 4-Factor Priority Formula
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {priority} ({priorityScore || 50}/100)
          </span>
        </div>

        <PriorityMeter
          score={priorityScore}
          priority={priority}
          factors={priorityFactors}
        />

        {priorityExplanation && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 italic">
            &ldquo;{priorityExplanation}&rdquo;
          </p>
        )}
      </div>

      {/* Detected AI Labels */}
      {aiAnalysis?.detectedLabels && aiAnalysis.detectedLabels.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-3.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Tags:</span>
          {aiAnalysis.detectedLabels.map((lbl, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300">
              {lbl}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
