import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Building2,
  Bell
} from 'lucide-react';
import { adminService } from '../../services/complaintService';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminEscalations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState(false);
  const navigate = useNavigate();

  const fetchEscalations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEscalations();
      if (res.success) setData(res);
    } catch (err) {
      console.error('Error fetching escalations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleManualAudit = async () => {
    setRunningCheck(true);
    await fetchEscalations();
    setRunningCheck(false);
  };

  if (loading) {
    return <Loader message="Evaluating SLA deadlines and escalation triggers..." size="lg" />;
  }

  const complaints = data?.complaints || [];
  const rules = data?.rules || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Automated Escalation Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SLA Escalations & Delayed Cases
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Proactive monitoring engine flags approaching deadlines and automatically escalates overdue cases to zonal supervisors and department heads.
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={RefreshCw}
          isLoading={runningCheck}
          onClick={handleManualAudit}
        >
          Run SLA Audit Scan
        </Button>
      </div>

      {/* SLA Policy Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {rules.map((r, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <PriorityBadge priority={r.priority} />
              <span className="font-bold text-civic-600">{r.slaHours}h SLA</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Warning at {r.warningThresholdPercent}% &bull; Auto-escalates past 0h
            </p>
          </div>
        ))}
      </div>

      {/* Escalated Cases Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Active Overdue & Escalated Cases ({complaints.length})
          </h3>
          <p className="text-xs text-slate-400">Grievances that have exceeded target municipal resolution windows</p>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="Zero SLA Breaches"
            description="All active municipal complaints are currently within their designated SLA timeframes."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {complaints.map((c) => (
              <div
                key={c._id || c.complaintId}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold text-rose-600">
                        {c.complaintId}
                      </span>
                      <span className="text-xs text-slate-400">&bull;</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {c.department?.name || 'Department'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {c.sla?.escalationTier || 'Tier 1 Escalation'}
                      </span>
                    </div>
                    <h4
                      onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
                      className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-civic-600 cursor-pointer"
                    >
                      {c.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                {/* Escalation Reason */}
                {c.sla?.escalationReason && (
                  <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 font-medium">
                    <strong>AI Escalation Agent Brief:</strong> {c.sla.escalationReason}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>Target SLA: {c.sla?.targetResolutionHours || 72}h</span>
                    <span>&bull;</span>
                    <span>Deadline: {c.sla?.deadline ? new Date(c.sla.deadline).toLocaleDateString() : 'N/A'}</span>
                    <span>&bull;</span>
                    <span>Citizen: {c.citizen?.name || 'Citizen'}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
                  >
                    Take Action on Case &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
