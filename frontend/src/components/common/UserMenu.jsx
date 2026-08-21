import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { ROLE_LABELS } from '../../constants/roles';

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const ref = useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const initials = getInitials(user.name);
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  return (
    <div className="relative" ref={ref}>
      <button
        id="user-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-7 h-7 rounded-lg bg-civic-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">{user.name}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{roleLabel}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
            <span className="inline-block mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-civic-100 dark:bg-civic-950 text-civic-700 dark:text-civic-300">
              {roleLabel}
            </span>
          </div>

          {/* Menu items */}
          <div className="p-1.5 space-y-0.5">
            <Link
              to="/citizen/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              My Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
