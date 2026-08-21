import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  Building2,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { complaintService, adminService } from '../../services/complaintService';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { AIAssistantBadge } from '../../components/ai/AIAssistantBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Reassign Modal State
  const [reassignCase, setReassignCase] = useState(null);
  const [targetDeptId, setTargetDeptId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [reassignLoading, setReassignLoading] = useState(false);

  const navigate = useNavigate();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const [compRes, deptRes] = await Promise.all([
        complaintService.getComplaints({
          search,
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          limit: 100
        }),
        adminService.getDepartments()
      ]);
      if (compRes.success) setComplaints(compRes.complaints || []);
      if (deptRes.success) setDepartments(deptRes.departments || []);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  const handleReassign = async (e) => {
    e.preventDefault();
    if (!targetDeptId) return;
    setReassignLoading(true);
    try {
      const res = await complaintService.reassignComplaint(reassignCase._id, {
        departmentId: targetDeptId,
        reason: reassignReason || 'Administrative reassignment override'
      });
      if (res.success) {
        setComplaints(prev => prev.map(c => (c._id === reassignCase._id ? res.complaint : c)));
        setReassignCase(null);
        setTargetDeptId('');
        setReassignReason('');
      }
    } catch (err) {
      alert('Failed to reassign: ' + (err.response?.data?.message || err.message));
    } finally {
      setReassignLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Master Civic Complaints Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View, audit, prioritize, and administratively reassign all city complaints.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, keyword, ward..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Assigned">Assigned</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Roads & Potholes">Roads & Potholes</option>
          <option value="Drainage">Drainage</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Streetlights">Streetlights</option>
          <option value="Public Facilities">Public Facilities</option>
        </select>
      </div>

      {/* Complaints Master Table */}
      {loading ? (
        <Loader message="Loading civic registry records..." size="md" />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No matching civic cases"
          description="Try broadening your filter criteria."
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); setCategoryFilter(''); }}
        />
      ) : (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3 pl-2">Case ID</th>
                <th className="pb-3">Title & Category</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">AI Model</th>
                <th className="pb-3">SLA / Deadline</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {complaints.map((c) => (
                <tr key={c._id || c.complaintId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-2 font-mono font-bold text-civic-700 dark:text-civic-400">
                    {c.complaintId}
                  </td>
                  <td className="py-3 max-w-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{c.title}</p>
                    <span className="text-[10px] text-slate-400">{c.category} &bull; {c.location?.ward || 'Ward 12'}</span>
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">
                    {c.department?.name || 'Unassigned'}
                  </td>
                  <td className="py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3">
                    <AIAssistantBadge analysisType={c.aiAnalysis?.analysisType} />
                  </td>
                  <td className="py-3 text-[11px] text-slate-500">
                    {c.sla?.deadline ? new Date(c.sla.deadline).toLocaleDateString() : 'Active'}
                    {c.sla?.isOverdue && (
                      <span className="block text-[10px] text-rose-600 font-bold">BREACHED</span>
                    )}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setReassignCase(c);
                          setTargetDeptId(c.department?._id || '');
                        }}
                      >
                        Reassign
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
                      >
                        File &rarr;
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Reassignment Modal */}
      {reassignCase && (
        <Modal
          isOpen={!!reassignCase}
          onClose={() => setReassignCase(null)}
          title={`Administrative Reassignment: ${reassignCase.complaintId}`}
          subtitle="Override AI routing and assign to another municipal department."
          maxWidth="max-w-md"
        >
          <form onSubmit={handleReassign} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Department *
              </label>
              <select
                required
                value={targetDeptId}
                onChange={(e) => setTargetDeptId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500"
              >
                <option value="">Select Department...</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason for Reassignment *
              </label>
              <textarea
                rows={2}
                required
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="e.g. Cross-departmental civil infrastructure scope required..."
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setReassignCase(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={reassignLoading}>
                Confirm Reassignment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
