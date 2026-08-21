import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/complaintService';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setOtpLoading(true);
    setError('');
    try {
      const res = await authService.sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setDemoOtpHint(res.demoOtp || '123456');
      }
    } catch (err) {
      setError('Failed to dispatch OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP received.');
      return;
    }
    setOtpLoading(true);
    setError('');
    try {
      const res = await authService.verifyOtp(phone, otp);
      if (res.success) {
        setIsPhoneVerified(true);
        setOtpSent(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register({
        name,
        email,
        phone,
        password
      });

      if (res.success) {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-civic-700 to-civic-500 flex items-center justify-center text-white mx-auto shadow-md shadow-civic-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Create Citizen Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join the digital municipal governance platform
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mobile Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-civic-500 focus:outline-none"
                />
              </div>
              {!isPhoneVerified ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={otpLoading}
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold px-2">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              )}
            </div>

            {/* OTP verification box */}
            {otpSent && !isPhoneVerified && (
              <div className="mt-2 p-3 rounded-xl bg-civic-50 dark:bg-civic-950/60 border border-civic-200 dark:border-civic-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-civic-800 dark:text-civic-200">
                    Enter OTP (Demo code: {demoOtpHint})
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-32 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs tracking-widest font-mono"
                  />
                  <Button size="sm" variant="primary" onClick={handleVerifyOtp} isLoading={otpLoading}>
                    Verify
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
            Create Citizen Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-civic-600 dark:text-civic-400 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
