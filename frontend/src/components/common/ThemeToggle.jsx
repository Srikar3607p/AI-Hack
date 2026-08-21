import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-civic-500/20 ${className}`}
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-700 hover:text-civic-600 transition-transform duration-300 hover:-rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300 transition-transform duration-300 hover:rotate-45" />
      )}
    </button>
  );
};
