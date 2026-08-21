import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-xs">
        {headers.length > 0 && (
          <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="pb-3 px-3 first:pl-2 last:pr-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
          {children}
        </tbody>
      </table>
    </div>
  );
};
