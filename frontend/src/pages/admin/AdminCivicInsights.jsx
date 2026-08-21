import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/complaintService';
import { HotspotMap } from '../../components/maps/HotspotMap';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

export const AdminCivicInsights = () => {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await adminService.getCivicInsights();
        if (res.success) setInsightsData(res.data);
      } catch (err) {
        console.error('Error fetching civic insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return <Loader message="Running spatial clustering and recurring problem detection algorithms..." size="lg" isAi={true} />;
  }

  const clusters = insightsData?.clusters || [];
  const wardHotspots = insightsData?.wardHotspots || [];
  const insights = insightsData?.insights || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-civic-950 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Predictive Spatial Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Civic Insights & Recurring Problem Detection
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl">
          Automated spatial clustering algorithm detects repeated civic failures in close geographic proximity, empowering municipal leaders to prevent chronic infrastructure breakdowns.
        </p>
      </div>

      {/* AI Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {ins.category}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                Confidence: {Math.round(ins.confidence * 100)}%
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ins.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ins.description}
            </p>

            <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 text-[11px] text-purple-900 dark:text-purple-200 font-medium">
              <strong>Action:</strong> {ins.suggestedAction}
            </div>
          </div>
        ))}
      </div>

      {/* Hotspot GIS Spatial Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              Identified Civic Problem Clusters & Geo-Fenced Hotspots
            </h3>
            <p className="text-xs text-slate-400">
              Clusters are calculated using geospatial Haversine radius grouping (&le;350m) across matching categories.
            </p>
          </div>
        </div>
        <HotspotMap clusters={clusters} height="h-96" />
      </div>

      {/* Active Recurring Problem Clusters Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Active Recurring Problem Clusters
            </h3>
            <p className="text-xs text-slate-400">Aggregated cluster records requiring systemic municipal interventions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((cl) => (
            <div
              key={cl.clusterId || cl._id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-600">{cl.clusterId}</span>
                <Badge variant={cl.severity === 'Critical Chronic' ? 'danger' : 'warning'} size="sm">
                  {cl.severity}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{cl.name}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {cl.mitigationNotes}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Complaints</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cl.complaintCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Affected</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cl.affectedCitizensEstimate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Radius</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{cl.radiusMeters}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
