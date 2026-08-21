import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Clock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import { AIAssistantBadge } from '../../components/ai/AIAssistantBadge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) setStatusFilter(statusParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await complaintService.getComplaints({
          search,
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter
        });
        if (res.success) {
          setComplaints(res.complaints || []);
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchComplaints();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            My Reported Grievances
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comprehensive list of all your complaints, AI priority scoring, and lifecycle timelines.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={() => navigate('/citizen/complaints/new')}
        >
          Report New Issue
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, keyword, landmark..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Priority Filter */}
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

        {/* Category Filter */}
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

      {/* List / Loading / Empty */}
      {loading ? (
        <Loader message="Filtering civic case database..." size="md" />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No matching grievances found"
          description="Try adjusting your filter or search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('');
            setPriorityFilter('');
            setCategoryFilter('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {complaints.map((c) => (
            <div
              key={c._id || c.complaintId}
              onClick={() => navigate(`/citizen/complaints/${c._id || c.complaintId}`)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-civic-400 dark:hover:border-civic-600 shadow-sm transition-all cursor-pointer group space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
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
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-civic-600 transition-colors">
                    {c.title}
                  </h3>
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
                <div className="flex items-center gap-1.5 truncate max-w-md">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.location?.address || 'Mapped Location'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>SLA: {c.sla?.targetResolutionHours || 72}h</span>
                  <span className="font-bold text-civic-600 dark:text-civic-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
