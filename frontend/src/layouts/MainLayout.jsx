import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-200">Civic Aid Platform</span>
            <span>&bull;</span>
            <span>Simple Civic Support at Your Fingertips</span>
          </div>
          <p>Powered by Agentic AI Orchestration & Explainable Governance &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};
