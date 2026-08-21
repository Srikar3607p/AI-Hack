import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitComplaint } from './pages/citizen/SubmitComplaint';
import { CitizenComplaintsList } from './pages/citizen/CitizenComplaintsList';
import { ComplaintDetails } from './pages/citizen/ComplaintDetails';
import { CitizenProfile } from './pages/citizen/CitizenProfile';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminCivicInsights } from './pages/admin/AdminCivicInsights';
import { AdminEscalations } from './pages/admin/AdminEscalations';
import { AdminDepartments } from './pages/admin/AdminDepartments';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { SuperAdminUsers } from './pages/superadmin/SuperAdminUsers';
import { SuperAdminAuditLogs } from './pages/superadmin/SuperAdminAuditLogs';

export default function App() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Citizen Routes ────────────────────────────────────── */}
      <Route element={<DashboardLayout allowedRoles={['CITIZEN', 'ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/complaints" element={<CitizenComplaintsList />} />
        <Route path="/citizen/complaints/new" element={<SubmitComplaint />} />
        <Route path="/citizen/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
      </Route>

      {/* ── Officer Routes ────────────────────────────────────── */}
      <Route element={<DashboardLayout allowedRoles={['OFFICER', 'ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/complaints" element={<OfficerDashboard />} />
        <Route path="/officer/complaints/:id" element={<ComplaintDetails />} />
      </Route>

      {/* ── Admin Routes ──────────────────────────────────────── */}
      <Route element={<DashboardLayout allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/admin/civic-insights" element={<AdminCivicInsights />} />
        <Route path="/admin/escalations" element={<AdminEscalations />} />
        <Route path="/admin/departments" element={<AdminDepartments />} />
        {/* Admin also gets user management */}
        <Route path="/admin/users" element={<SuperAdminUsers />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/teams" element={<AdminDepartments />} />
        <Route path="/admin/settings" element={<AdminDashboard />} />
      </Route>

      {/* ── Super Admin Routes ────────────────────────────────── */}
      <Route element={<DashboardLayout allowedRoles={['SUPER_ADMIN']} />}>
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/users" element={<SuperAdminUsers />} />
        <Route path="/super-admin/admins" element={<SuperAdminUsers />} />
        <Route path="/super-admin/audit-logs" element={<SuperAdminAuditLogs />} />
        <Route path="/super-admin/system" element={<SuperAdminDashboard />} />
      </Route>

      {/* ── Fallback ──────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
