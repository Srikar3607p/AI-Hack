import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';

export const AIAssistantBadge = ({ analysisType = 'AI-assisted', isAiAssisted = true, className = '' }) => {
  const isFallback = analysisType === 'Fallback analysis' || !isAiAssisted;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
        isFallback
          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
          : 'bg-gradient-to-r from-civic-50 to-indigo-50 dark:from-civic-950/70 dark:to-indigo-950/70 text-civic-700 dark:text-civic-300 border-civic-200 dark:border-civic-800 shadow-xs'
      } ${className}`}
      title={isFallback ? 'Deterministic Rule-Based Fallback Engine' : 'Groq Llama 3 Multimodal AI Orchestrator'}
    >
      {isFallback ? (
        <Cpu className="w-3.5 h-3.5 text-amber-500" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-civic-500 animate-pulse" />
      )}
      <span>{analysisType || (isFallback ? 'Fallback analysis' : 'AI-assisted')}</span>
    </span>
  );
};
