import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, PlusCircle, LogOut, User, Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { Badge } from './Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'OFFICER': return '/officer/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      case 'SUPER_ADMIN': return '/super-admin/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-civic-700 to-civic-500 flex items-center justify-center text-white shadow-md shadow-civic-600/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Civic Aid
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-civic-100 dark:bg-civic-900/60 text-civic-700 dark:text-civic-300">
                  AI Gov
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
                Simple Civic Support at Your Fingertips
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Actions, Theme, Auth Profile */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {user.role === 'CITIZEN' && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={PlusCircle}
                  onClick={() => navigate('/citizen/complaints/new')}
                  className="hidden sm:inline-flex"
                >
                  Report Issue
                </Button>
              )}

              <Link
                to={getDashboardPath()}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-civic-600 dark:hover:text-civic-400 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
              >
                Dashboard
              </Link>

              {/* User Dropdown / Badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-civic-100 dark:bg-civic-900/80 text-civic-700 dark:text-civic-300 flex items-center justify-center font-bold text-xs border border-civic-200 dark:border-civic-800">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
