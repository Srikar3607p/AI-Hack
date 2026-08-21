import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  FileCheck2,
  Users,
  Building2,
  Lock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (email, password, redirectPath) => {
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Demo login error:', err);
      navigate('/login');
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/citizen/dashboard';
    switch (user.role) {
      case 'OFFICER': return '/officer/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      case 'SUPER_ADMIN': return '/super-admin/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-civic-500/10 dark:bg-civic-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-civic-50 dark:bg-civic-950/80 border border-civic-200 dark:border-civic-800/80 text-xs font-semibold text-civic-700 dark:text-civic-300 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-civic-500 animate-pulse" />
            <span>Agentic AI Civic Governance & Complaint Resolution Intelligence</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Simple Civic Support <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-civic-600 via-civic-500 to-indigo-600 bg-clip-text text-transparent">
              at Your Fingertips.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Civic Aid empowers citizens to report everyday problems in seconds while intelligent AI agents classify, prioritize, route, monitor, and verify resolutions with 100% municipal accountability.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate(getDashboardPath())}
                icon={ArrowRight}
              >
                Go to Your Portal ({user.role})
              </Button>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="primary" icon={ArrowRight}>
                    Report an Issue
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary" icon={Building2}>
                    Department / Admin Portal
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hackathon Judge 1-Click Sandbox Bar */}
          <div className="pt-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-md max-w-3xl mx-auto text-left">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Judge Quick Demo Access
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">1-Click Role Login</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('citizen@civicaid.gov', 'Citizen@123', '/citizen/dashboard')}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 hover:border-civic-300 text-left transition-all group"
                >
                  <p className="text-[10px] font-bold text-civic-600 dark:text-civic-400 uppercase">Citizen</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-civic-600">Rohan Sharma</p>
                  <p className="text-[10px] text-slate-400">Report & Track &rarr;</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('officer.roads@civicaid.gov', 'Officer@123', '/officer/dashboard')}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 hover:border-civic-300 text-left transition-all group"
                >
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Officer (Roads)</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-civic-600">Vikram Verma</p>
                  <p className="text-[10px] text-slate-400">Triage & Resolve &rarr;</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@civicaid.gov', 'Admin@123', '/admin/dashboard')}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 hover:border-civic-300 text-left transition-all group"
                >
                  <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">Admin</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-civic-600">Dr. Meera N.</p>
                  <p className="text-[10px] text-slate-400">Analytics & Insights &rarr;</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('superadmin@civicaid.gov', 'SuperAdmin@123', '/super-admin/dashboard')}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 hover:border-civic-300 text-left transition-all group"
                >
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Super Admin</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-civic-600">Commissioner</p>
                  <p className="text-[10px] text-slate-400">Full System Control &rarr;</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-civic-600 dark:text-civic-400">
            End-to-End Civic Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            From Citizen Report to Verified Resolution
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Coordinated by 8 specialized AI agents with 100% resilient fallback and transparent audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Report', desc: 'Citizen inputs voice, text, photo, and map coordinates in seconds.', icon: MapPin },
            { step: '02', title: 'Analyze', desc: 'AI Orchestrator classifies category, calculates 4-factor priority score, and checks duplicate proximity.', icon: Brain },
            { step: '03', title: 'Route', desc: 'Auto-routed to the municipal department and specialized field response unit with custom SLA.', icon: Layers },
            { step: '04', title: 'Resolve', desc: 'Officer executes repair, logs action notes, and AI verifies before/after evidence.', icon: CheckCircle },
            { step: '05', title: 'Track & Learn', desc: 'Citizen receives transparent explanation. Spatial AI groups recurring problem clusters.', icon: TrendingUp }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-civic-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-civic-50 dark:bg-civic-950/80 text-civic-600 dark:text-civic-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-300 dark:text-slate-700">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-civic-600 dark:text-civic-400">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Real-World Governance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Explainable AI Prioritization</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transparent 4-factor formula (40% Impact, 35% Urgency, 15% Affected Citizens, 10% Duration) explains every score without black-box obscurity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Duplicate & Clustering Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Spatial vector proximity detects when multiple citizens report the same crater or burst pipe, preventing fragmented duplicate work orders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Automated SLA Escalation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Proactive agents monitor unresolved cases against strict SLA deadlines, generating supervisory briefs and escalating overdue cases.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
