import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { adminService, complaintService } from '../../services/complaintService';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { ComplaintMap } from '../../components/maps/ComplaintMap';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';

const COLORS = ['#0c87eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, complaintsRes] = await Promise.all([
          adminService.getAnalytics(),
          complaintService.getComplaints({ limit: 15 })
        ]);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (complaintsRes.success) setComplaints(complaintsRes.complaints || []);
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader message="Aggregating municipal analytics and KPI telemetry..." size="lg" />;
  }

  const kpis = analytics?.kpis || {};
  const byCategory = analytics?.byCategory || [];
  const byPriority = analytics?.byPriority || [];
  const byDepartment = analytics?.byDepartment || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-civic-950 via-slate-900 to-indigo-950 text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-civic-500/20 text-civic-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Civic Governance Executive Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Command & Analytics
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Real-time civic intelligence, SLA compliance tracking, department throughput, and geographic complaint distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            onClick={() => navigate('/admin/civic-insights')}
          >
            Civic Insights & AI Clusters
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 sm:col-span-2">
          <span className="text-[11px] font-semibold text-slate-500">Total Grievances</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpis.total || 0}</p>
          <span className="text-[10px] text-slate-400">Total cases logged</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 sm:col-span-2">
          <span className="text-[11px] font-semibold text-amber-600">Pending / In Progress</span>
          <p className="text-2xl font-extrabold text-amber-600">{(kpis.pending || 0) + (kpis.inProgress || 0)}</p>
          <span className="text-[10px] text-slate-400">Active work queue</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 sm:col-span-2">
          <span className="text-[11px] font-semibold text-emerald-600">Resolved Cases</span>
          <p className="text-2xl font-extrabold text-emerald-600">{kpis.resolved || 0}</p>
          <span className="text-[10px] text-slate-400">Avg {kpis.avgResolutionHours || 28}h resolution</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 sm:col-span-2">
          <span className="text-[11px] font-semibold text-rose-600">Overdue / Escalated</span>
          <p className="text-2xl font-extrabold text-rose-600">{kpis.escalated || 0}</p>
          <span className="text-[10px] text-slate-400">SLA Breach: {100 - (kpis.slaComplianceRate || 95)}%</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Complaints by Civic Category
              </h3>
              <p className="text-xs text-slate-400">Distribution across municipal service domains</p>
            </div>
            <BarChart className="w-4 h-4 text-civic-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" height={45} />
                <YAxis fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#0c87eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority & Status Pie Charts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Priority Breakdown & Triage
              </h3>
              <p className="text-xs text-slate-400">Severity distribution calculated by 4-factor AI</p>
            </div>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {byPriority.map((entry, index) => {
                    let color = '#0c87eb';
                    if (entry.name === 'Critical') color = '#dc2626';
                    else if (entry.name === 'High') color = '#ea580c';
                    else if (entry.name === 'Medium') color = '#eab308';
                    else color = '#64748b';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Workloads & Throughput Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Department Performance & Throughput
            </h3>
            <p className="text-xs text-slate-400">Resolution velocity across municipal divisions</p>
          </div>
          <Link to="/admin/departments" className="text-xs font-bold text-civic-600 hover:underline">
            Manage Teams &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="pb-3">Department</th>
                <th className="pb-3">Code</th>
                <th className="pb-3">Total Cases</th>
                <th className="pb-3">Resolved</th>
                <th className="pb-3">Pending</th>
                <th className="pb-3">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {byDepartment.map((dept, idx) => {
                const rate = dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 100;
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{dept.name}</td>
                    <td className="py-3 text-slate-500 font-mono">{dept.code}</td>
                    <td className="py-3">{dept.total}</td>
                    <td className="py-3 text-emerald-600 font-semibold">{dept.resolved}</td>
                    <td className="py-3 text-amber-600 font-semibold">{dept.pending}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-civic-600 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="font-bold">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* GIS Hotspot Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-civic-600" />
              Live City GIS Case Map & Incident Hotspots
            </h3>
            <p className="text-xs text-slate-400">Visual geospatial tracking of all active complaints</p>
          </div>
          <Link to="/admin/complaints" className="text-xs font-bold text-civic-600 hover:underline">
            View All Complaints &rarr;
          </Link>
        </div>
        <ComplaintMap complaints={complaints} height="h-96" />
      </div>
    </div>
  );
};
