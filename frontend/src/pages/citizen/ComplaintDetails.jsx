import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { PriorityBadge, StatusBadge, Badge } from '../../components/common/Badge';
import { AIExplanationCard } from '../../components/ai/AIExplanationCard';
import { DuplicateAlert } from '../../components/ai/DuplicateAlert';
import { ComplaintTimeline } from '../../components/complaints/ComplaintTimeline';
import { ComplaintMap } from '../../components/maps/ComplaintMap';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reopen Modal state
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [reopenLoading, setReopenLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await complaintService.getComplaintById(id);
        if (res.success && res.complaint) {
          setComplaint(res.complaint);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Complaint record not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleReopen = async (e) => {
    e.preventDefault();
    if (!reopenReason || reopenReason.trim().length < 5) return;
    setReopenLoading(true);
    try {
      const res = await complaintService.reopenComplaint(complaint._id, reopenReason);
      if (res.success) {
        setComplaint(res.complaint);
        setIsReopenOpen(false);
        setReopenReason('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen complaint.');
    } finally {
      setReopenLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading civic case file and AI timeline..." size="lg" />;
  }

  if (error || !complaint) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{error || 'Complaint Not Found'}</h3>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          &larr; Go Back
        </Button>
      </div>
    );
  }

  const isResolved = complaint.status === 'Resolved' || complaint.status === 'Closed';

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumbs & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-civic-600 dark:hover:text-civic-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>

        <div className="flex items-center gap-2">
          {isResolved && (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => setIsReopenOpen(true)}
              className="text-amber-600 hover:text-amber-700 border-amber-300 dark:border-amber-700"
            >
              Reopen Case
            </Button>
          )}
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-extrabold text-civic-600 dark:text-civic-400 text-sm">
            {complaint.complaintId}
          </span>
          <span>&bull;</span>
          <span>Submitted on {new Date(complaint.createdAt).toLocaleDateString()}</span>
          <span>&bull;</span>
          <span>Category: <strong className="text-slate-800 dark:text-slate-200">{complaint.category}</strong></span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {complaint.title}
        </h1>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {complaint.description}
        </p>

        {/* Attached Photos */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Citizen Photo Evidence ({complaint.images.length})
            </span>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {complaint.images.map((img, idx) => (
                <a
                  key={idx}
                  href={img}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                >
                  <img src={img} alt={`Evidence ${idx + 1}`} className="w-24 h-24 object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Alert if flagged */}
      <DuplicateAlert duplicateInfo={complaint.aiAnalysis?.duplicateInfo} />

      {/* Resolution Section (When resolved) */}
      {complaint.resolution && complaint.resolution.resolvedAt && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                  Municipal Resolution Verified
                </h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Resolved on {new Date(complaint.resolution.resolvedAt).toLocaleString()}
                </p>
              </div>
            </div>
            {complaint.resolution.aiVerification?.verified && (
              <Badge variant="success" size="sm">
                AI Verified Evidence ({Math.round((complaint.resolution.aiVerification?.confidence || 0.90) * 100)}%)
              </Badge>
            )}
          </div>

          {/* Citizen-Friendly Transparent Explanation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
              Official Resolution Explanation for Citizen
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {complaint.resolution.citizenExplanation || complaint.resolution.resolutionNotes}
            </p>
          </div>

          {/* Officer Field Notes */}
          <div className="text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Field Technical Notes:</strong> {complaint.resolution.resolutionNotes}
          </div>

          {/* After Photos */}
          {complaint.resolution.afterImages && complaint.resolution.afterImages.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-2">
                Work Completion Photos
              </span>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {complaint.resolution.afterImages.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="shrink-0 rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-transform">
                    <img src={img} alt={`After ${idx + 1}`} className="w-24 h-24 object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Two Column Grid: AI Decision Card vs SLA & Department Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Decision Card */}
        <div className="lg:col-span-2 space-y-6">
          <AIExplanationCard
            aiAnalysis={complaint.aiAnalysis}
            priority={complaint.priority}
            priorityScore={complaint.priorityScore}
            priorityFactors={complaint.priorityFactors}
            priorityExplanation={complaint.priorityExplanation}
            departmentName={complaint.department?.name}
            assignedTeamName={complaint.assignedTeam?.name}
            category={complaint.category}
            issueType={complaint.issueType}
          />

          {/* Timeline */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <ComplaintTimeline timeline={complaint.timeline} />
          </div>
        </div>

        {/* Right 1 Col: Location Map & SLA */}
        <div className="space-y-6">
          {/* SLA Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-civic-600" /> SLA Target
              </span>
              <span className="text-xs font-bold text-civic-600">
                {complaint.sla?.targetResolutionHours || 72} Hours
              </span>
            </div>

            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Deadline:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {complaint.sla?.deadline ? new Date(complaint.sla.deadline).toLocaleString() : 'Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {complaint.department?.name || 'Assigned Department'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Field Unit:</span>
                <span className="font-semibold text-civic-600 dark:text-civic-400 truncate max-w-[140px]">
                  {complaint.assignedTeam?.name || 'Rapid Response'}
                </span>
              </div>
              {complaint.sla?.isOverdue && (
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-[11px] flex items-center gap-1.5 mt-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Case Overdue (Escalated)
                </div>
              )}
            </div>
          </div>

          {/* Location Card & Map */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-civic-600" /> GIS Coordinates
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {complaint.location?.address || 'Mapped Location'}
            </p>
            <span className="text-[11px] font-semibold text-slate-400 block">
              Zone: {complaint.location?.zone || 'Central Zone'} | {complaint.location?.ward || 'Ward 12'}
            </span>
            <ComplaintMap complaints={[complaint]} height="h-48" />
          </div>
        </div>
      </div>

      {/* Reopen Complaint Modal */}
      <Modal
        isOpen={isReopenOpen}
        onClose={() => setIsReopenOpen(false)}
        title="Reopen Resolved Case"
        subtitle="Explain why this resolution is incomplete or if the problem has recurred."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleReopen} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Reopening *
            </label>
            <textarea
              required
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. The streetlight bulb was fixed but flickered out again after 2 hours..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsReopenOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" isLoading={reopenLoading}>
              Reopen Grievance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
