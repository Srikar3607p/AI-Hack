import React, { useState, useEffect } from 'react';
import { History, Search, Shield, Filter, Clock, User } from 'lucide-react';
import { adminService } from '../../services/complaintService';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const SuperAdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAuditLogs({ action: actionFilter, limit: 100 });
        if (res.success) setLogs(res.logs || []);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [actionFilter]);

  if (loading) {
    return <Loader message="Retrieving secure system audit records..." size="lg" />;
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          System Audit Logs & Traceability
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Immutable event log of administrative actions, AI classification triggers, status transitions, and user logins.
        </p>
      </div>

      {/* Action Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">Filter Event Action:</span>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500"
        >
          <option value="">All Events</option>
          <option value="USER_LOGIN">User Login</option>
          <option value="COMPLAINT_CREATED">Complaint Created</option>
          <option value="COMPLAINT_STATUS_UPDATED">Status Updated</option>
          <option value="COMPLAINT_RESOLVED">Complaint Resolved</option>
          <option value="COMPLAINT_REOPENED">Complaint Reopened</option>
          <option value="COMPLAINT_AUTO_ESCALATED">Auto Escalation</option>
          <option value="USER_ROLE_STATUS_UPDATED">Role / Status Updated</option>
        </select>
      </div>

      {/* Logs Table */}
      {logs.length === 0 ? (
        <EmptyState
          title="No audit events found"
          description="Try selecting a different action filter."
        />
      ) : (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3 pl-2">Timestamp</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Performer</th>
                <th className="pb-3">Target Resource</th>
                <th className="pb-3">Payload Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-2 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 font-mono font-bold text-civic-700 dark:text-civic-400 text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.performerName}</span>
                    <span className="text-[10px] text-slate-400 block">{log.performerRole}</span>
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">
                    {log.targetResource} {log.targetId && `(${log.targetId})`}
                  </td>
                  <td className="py-3 text-slate-500 text-[11px] max-w-xs truncate font-mono">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
