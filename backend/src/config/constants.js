export const ROLES = {
  CITIZEN: 'CITIZEN',
  OFFICER: 'OFFICER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export const CATEGORIES = [
  'Roads & Potholes',
  'Drainage',
  'Waste Management',
  'Water Supply',
  'Streetlights',
  'Public Facilities',
  'Other'
];

export const COMPLAINT_STATUS = {
  SUBMITTED: 'Submitted',
  AI_PROCESSING: 'AI Processing',
  ASSIGNED: 'Assigned',
  ACKNOWLEDGED: 'Acknowledged',
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected'
};

export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const DEFAULT_SLA_HOURS = {
  Critical: 24,
  High: 48,
  Medium: 72,
  Low: 168 // 7 days
};
