import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  sendOtp: async (phone) => {
    const res = await api.post('/auth/send-otp', { phone });
    return res.data;
  },
  verifyOtp: async (phone, otp) => {
    const res = await api.post('/auth/verify-otp', { phone, otp });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  }
};

export const complaintService = {
  submitComplaint: async (formData) => {
    const res = await api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getComplaints: async (params = {}) => {
    const res = await api.get('/complaints', { params });
    return res.data;
  },
  getComplaintById: async (id) => {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },
  updateStatus: async (id, status, notes, assignedOfficerId) => {
    const res = await api.patch(`/complaints/${id}`, { status, notes, assignedOfficerId });
    return res.data;
  },
  submitResolution: async (id, formData) => {
    const res = await api.post(`/complaints/${id}/resolution`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  reopenComplaint: async (id, reason) => {
    const res = await api.post(`/complaints/${id}/reopen`, { reason });
    return res.data;
  },
  reassignComplaint: async (id, reassignData) => {
    const res = await api.post(`/complaints/${id}/reassign`, reassignData);
    return res.data;
  }
};

export const adminService = {
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  getCivicInsights: async () => {
    const res = await api.get('/admin/insights');
    return res.data;
  },
  getEscalations: async () => {
    const res = await api.get('/admin/escalations');
    return res.data;
  },
  getDepartments: async () => {
    const res = await api.get('/admin/departments');
    return res.data;
  },
  createOrUpdateDepartment: async (deptData) => {
    const res = await api.post('/admin/departments', deptData);
    return res.data;
  },
  getTeams: async () => {
    const res = await api.get('/admin/teams');
    return res.data;
  },
  createTeam: async (teamData) => {
    const res = await api.post('/admin/teams', teamData);
    return res.data;
  },
  getUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },
  updateUserRoleStatus: async (id, data) => {
    const res = await api.patch(`/admin/users/${id}/role`, data);
    return res.data;
  },
  getAuditLogs: async (params = {}) => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },
  getSystemHealth: async () => {
    const res = await api.get('/admin/health');
    return res.data;
  }
};
