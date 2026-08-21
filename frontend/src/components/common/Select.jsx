import React from 'react';

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border ${
          error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-civic-500'
        } rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors ${className}`}
        {...props}
      >
        {children ? children : (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        )}
      </select>
      {error && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};
