import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { adminService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const SuperAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [uRes, dRes] = await Promise.all([
        adminService.getUsers({ search, role: roleFilter }),
        adminService.getDepartments()
      ]);
      if (uRes.success) setUsers(uRes.users || []);
      if (dRes.success) setDepartments(dRes.departments || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const handleRoleChange = async (userId, newRole, deptId) => {
    try {
      const res = await adminService.updateUserRoleStatus(userId, {
        role: newRole,
        ...(deptId !== undefined && { departmentId: deptId })
      });
      if (res.success) {
        setUsers(prev => prev.map(u => (u._id === userId ? res.user : u)));
      }
    } catch (err) {
      alert('Failed to update user role: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const res = await adminService.updateUserRoleStatus(userId, { isActive: !currentActive });
      if (res.success) {
        setUsers(prev => prev.map(u => (u._id === userId ? res.user : u)));
      }
    } catch (err) {
      alert('Failed to update user status.');
    }
  };

  if (loading) {
    return <Loader message="Fetching user directory..." size="lg" />;
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          User & Role Control
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage system privileges, assign department officers, and toggle access controls.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="CITIZEN">Citizen</option>
          <option value="OFFICER">Department Officer</option>
          <option value="ADMIN">Administrator</option>
          <option value="SUPER_ADMIN">Super Administrator</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="pb-3 pl-2">User Details</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Assigned Department</th>
              <th className="pb-3">Account Status</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 pl-2">
                  <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                  <p className="text-[11px] text-slate-400">{u.email} {u.phone && `&bull; ${u.phone}`}</p>
                </td>
                <td className="py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-xs"
                  >
                    <option value="CITIZEN">CITIZEN</option>
                    <option value="OFFICER">OFFICER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>
                <td className="py-3">
                  {u.role === 'OFFICER' ? (
                    <select
                      value={u.department?._id || u.department || ''}
                      onChange={(e) => handleRoleChange(u._id, 'OFFICER', e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <option value="">Select Department...</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-slate-400 text-xs">&mdash;</span>
                  )}
                </td>
                <td className="py-3">
                  {u.isActive ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Suspended
                    </span>
                  )}
                </td>
                <td className="py-3 text-right pr-2">
                  <Button
                    size="sm"
                    variant={u.isActive ? 'ghost' : 'success'}
                    onClick={() => handleToggleActive(u._id, u.isActive)}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
