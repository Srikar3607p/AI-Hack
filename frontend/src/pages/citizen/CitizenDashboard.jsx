import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { AIAssistantBadge } from '../../components/ai/AIAssistantBadge';
import { ComplaintMap } from '../../components/maps/ComplaintMap';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await complaintService.getComplaints({ limit: 10 });
        if (res.success) {
          setComplaints(res.complaints || []);
        }
      } catch (err) {
        console.error('Error loading citizen complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const totalCount = complaints.length;
  const activeCount = complaints.filter(c => !['Resolved', 'Closed', 'Rejected'].includes(c.status)).length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const reopenedCount = complaints.filter(c => c.reopened?.isReopened).length;

  if (loading) {
    return <Loader message="Fetching your civic grievances and AI tracking updates..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-civic-900 via-civic-800 to-indigo-900 text-white shadow-lg relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-civic-200 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Citizen Governance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-civic-200 max-w-xl">
            Track your submitted civic reports, inspect real-time AI classification metrics, and verify resolutions.
          </p>
        </div>

        <div className="relative z-10">
          <Button
            variant="success"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/citizen/complaints/new')}
            className="shadow-lg shadow-emerald-950/40"
          >
            Report Civic Issue
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Reported</span>
            <FileText className="w-4 h-4 text-civic-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalCount}
          </p>
          <span className="text-[10px] text-slate-400">All submitted cases</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <span>Active / In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {activeCount}
          </p>
          <span className="text-[10px] text-slate-400">Under municipal action</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span>Resolved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </p>
          <span className="text-[10px] text-slate-400">Verified resolutions</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-xs font-semibold">
            <span>Reopened</span>
            <RotateCcw className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            {reopenedCount}
          </p>
          <span className="text-[10px] text-slate-400">Returned for re-work</span>
        </div>
      </div>

      {/* Map View of My Complaints */}
      {complaints.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-civic-600" />
              GIS Map of Your Reported Grievances
            </h3>
          </div>
          <ComplaintMap complaints={complaints} height="h-72" />
        </div>
      )}

      {/* Recent Complaints List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Grievances
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status and AI analysis timeline for each case
            </p>
          </div>
          <Link
            to="/citizen/complaints"
            className="text-xs font-bold text-civic-600 dark:text-civic-400 hover:underline flex items-center gap-1"
          >
            View All ({totalCount}) &rarr;
          </Link>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No grievances submitted yet"
            description="Notice a broken streetlight, pothole, or garbage accumulation in your neighborhood? Submit your first report."
            actionLabel="Report a Civic Issue"
            onAction={() => navigate('/citizen/complaints/new')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {complaints.map((c) => (
              <div
                key={c._id || c.complaintId}
                onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-civic-400 dark:hover:border-civic-600 shadow-sm transition-all cursor-pointer group space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-civic-700 dark:text-civic-400">
                        {c.complaintId}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">&bull;</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {c.category}
                      </span>
                      <AIAssistantBadge analysisType={c.aiAnalysis?.analysisType} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-civic-600 transition-colors">
                      {c.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {c.aiAnalysis?.summary || c.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-sm">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.location?.address || 'Location on map'}</span>
                  </div>
                  <span className="font-semibold text-civic-600 dark:text-civic-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Timeline &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
