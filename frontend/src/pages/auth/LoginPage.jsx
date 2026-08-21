import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        const role = res.user.role;
        if (role === 'OFFICER') navigate('/officer/dashboard');
        else if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'SUPER_ADMIN') navigate('/super-admin/dashboard');
        else navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-civic-700 to-civic-500 flex items-center justify-center text-white mx-auto shadow-md shadow-civic-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Civic Aid Portal Login
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access citizen reporting or municipal administration
          </p>
        </div>

        {/* Quick Demo Fill Tabs */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 text-center">
            Demo Credentials (1-Click Fill)
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('citizen@civicaid.gov', 'Citizen@123')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('officer.roads@civicaid.gov', 'Officer@123')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Officer (Roads)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@civicaid.gov', 'Admin@123')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('superadmin@civicaid.gov', 'SuperAdmin@123')}
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-civic-50 dark:hover:bg-civic-950/60 border border-slate-200 dark:border-slate-700 text-left font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Super Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@civicaid.gov"
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full"
            icon={ArrowRight}
          >
            Authenticate & Enter
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          New citizen?{' '}
          <Link to="/register" className="font-bold text-civic-600 dark:text-civic-400 hover:underline">
            Register for Civic Aid
          </Link>
        </div>
      </div>
    </div>
  );
};
