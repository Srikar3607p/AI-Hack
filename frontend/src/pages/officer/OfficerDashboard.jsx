import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  Building2,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { AIAssistantBadge } from '../../components/ai/AIAssistantBadge';
import { Button } from '../../components/common/Button';
import { ResolutionModal } from '../../components/complaints/ResolutionModal';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [activeComplaintForResolve, setActiveComplaintForResolve] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) setStatusFilter(statusParam);
  }, [searchParams]);

  const fetchAssignedComplaints = async () => {
    setLoading(true);
    try {
      const res = await complaintService.getComplaints({
        search,
        status: statusFilter,
        priority: priorityFilter
      });
      if (res.success) {
        setComplaints(res.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching officer complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignedComplaints();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await complaintService.updateStatus(id, newStatus, `Status updated to ${newStatus} by field officer ${user.name}`);
      if (res.success) {
        setComplaints(prev => prev.map(c => (c._id === id ? res.complaint : c)));
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const totalAssigned = complaints.length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical' && c.status !== 'Resolved').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-civic-950 text-white shadow-lg space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-civic-500/20 text-civic-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{user?.department?.name || 'Municipal Department Operations'}</span>
          </div>
          <span className="text-xs text-slate-400">
            Field Officer: <strong className="text-white">{user?.name}</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Field Operations & Case Triage
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl">
          Review complaints routed by the AI Orchestrator, prioritize urgent field hazards, execute repairs, and submit evidence for AI resolution verification.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Assigned Cases</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalAssigned}
          </p>
          <span className="text-[10px] text-slate-400">In department queue</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Critical Priority</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {criticalCount}
          </p>
          <span className="text-[10px] text-slate-400">Immediate hazard triage</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">In Progress</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {inProgressCount}
          </p>
          <span className="text-[10px] text-slate-400">Active field work</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Resolved Cases</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </p>
          <span className="text-[10px] text-slate-400">AI verified completed</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
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
          <option value="Critical">Critical Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* Case Table / Cards */}
      {loading ? (
        <Loader message="Loading assigned department queue..." size="md" />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No cases in queue"
          description="You are caught up with all assigned grievances."
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); }}
        />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c._id || c.complaintId}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all shadow-sm space-y-4 ${
                c.priority === 'Critical' && c.status !== 'Resolved'
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-civic-700 dark:text-civic-400">
                      {c.complaintId}
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {c.category}
                    </span>
                    <AIAssistantBadge analysisType={c.aiAnalysis?.analysisType} />
                    {c.sla?.isOverdue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse">
                        SLA Overdue
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
                    className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-civic-600 cursor-pointer"
                  >
                    {c.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>

              {/* Description & AI Summary */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs space-y-1">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-slate-100">Original Citizen Report:</strong> {c.description}
                </p>
                {c.aiAnalysis?.summary && (
                  <p className="text-civic-700 dark:text-civic-400 italic">
                    AI Summary: &ldquo;{c.aiAnalysis.summary}&rdquo;
                  </p>
                )}
              </div>

              {/* Footer Row: Details & Officer Workflow Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span>Ward: <strong className="text-slate-700 dark:text-slate-300">{c.location?.ward || 'Ward 12'}</strong></span>
                  <span>&bull;</span>
                  <span>SLA Target: <strong>{c.sla?.targetResolutionHours || 72}h</strong></span>
                  <span>&bull;</span>
                  <span>Deadline: <strong>{c.sla?.deadline ? new Date(c.sla.deadline).toLocaleDateString() : 'Active'}</strong></span>
                </div>

                {/* Workflow Action Buttons */}
                <div className="flex items-center gap-2">
                  {c.status === 'Assigned' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleQuickStatusChange(c._id, 'Acknowledged')}
                    >
                      Acknowledge Case
                    </Button>
                  )}

                  {['Assigned', 'Acknowledged'].includes(c.status) && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleQuickStatusChange(c._id, 'In Progress')}
                    >
                      Start Work (In Progress)
                    </Button>
                  )}

                  {c.status !== 'Resolved' && (
                    <Button
                      size="sm"
                      variant="success"
                      icon={Wrench}
                      onClick={() => setActiveComplaintForResolve(c)}
                    >
                      Submit Resolution & Evidence
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
                  >
                    View File &rarr;
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Submission Drawer / Modal */}
      {activeComplaintForResolve && (
        <ResolutionModal
          isOpen={!!activeComplaintForResolve}
          complaint={activeComplaintForResolve}
          onClose={() => setActiveComplaintForResolve(null)}
          onResolvedSuccess={(updated) => {
            setComplaints(prev => prev.map(c => (c._id === updated._id ? updated : c)));
            setActiveComplaintForResolve(null);
          }}
        />
      )}
    </div>
  );
};
