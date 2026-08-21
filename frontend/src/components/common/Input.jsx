import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${
            error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-civic-500'
          } rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
            Icon ? 'pl-9' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};
