import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  AlertTriangle,
  Sparkles,
  Building2,
  Users,
  ShieldCheck,
  Activity,
  History,
  User as UserIcon,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!user) return null;

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/complaints/new', label: 'Report Civic Issue', icon: PlusCircle, highlight: true },
    { to: '/citizen/complaints', label: 'My Complaints', icon: FileText },
    { to: '/citizen/profile', label: 'Citizen Profile', icon: UserIcon }
  ];

  const officerLinks = [
    { to: '/officer/dashboard', label: 'Officer Dashboard', icon: LayoutDashboard },
    { to: '/officer/complaints', label: 'Assigned Complaints', icon: FileText },
    { to: '/officer/complaints?status=In Progress', label: 'Active Work Queue', icon: CheckCircle }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Analytics & KPIs', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'All Complaints', icon: FileText },
    { to: '/admin/civic-insights', label: 'Civic Insights & Clusters', icon: Sparkles },
    { to: '/admin/escalations', label: 'Escalations & SLA', icon: AlertTriangle },
    { to: '/admin/departments', label: 'Departments & Teams', icon: Building2 },
    { to: '/admin/users', label: 'User Directory', icon: Users }
  ];

  const superAdminLinks = [
    { to: '/super-admin/dashboard', label: 'Super Admin Overview', icon: ShieldCheck },
    { to: '/admin/complaints', label: 'Civic Cases', icon: FileText },
    { to: '/admin/civic-insights', label: 'Civic Intelligence', icon: Sparkles },
    { to: '/admin/escalations', label: 'Escalations Monitor', icon: AlertTriangle },
    { to: '/super-admin/users', label: 'User & Role Control', icon: Users },
    { to: '/super-admin/audit-logs', label: 'System Audit Logs', icon: History },
    { to: '/super-admin/system', label: 'System Health & AI', icon: Activity }
  ];

  let links = citizenLinks;
  if (user.role === 'OFFICER') links = officerLinks;
  else if (user.role === 'ADMIN') links = adminLinks;
  else if (user.role === 'SUPER_ADMIN') links = superAdminLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Role Status Tag */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Portal
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-civic-100 dark:bg-civic-900 text-civic-700 dark:text-civic-300">
                {user.role}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
              {user.name}
            </p>
            {user.department?.name && (
              <p className="text-[11px] text-civic-600 dark:text-civic-400 font-medium truncate mt-0.5">
                Dept: {user.department.name}
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-civic-600 text-white shadow-md shadow-civic-600/20'
                        : link.highlight
                        ? 'bg-civic-50 dark:bg-civic-950/60 text-civic-700 dark:text-civic-300 hover:bg-civic-100 dark:hover:bg-civic-900 border border-civic-200 dark:border-civic-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Security Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Gov Cryptographic RBAC Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
