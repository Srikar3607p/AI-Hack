/**
 * backend/src/constants/index.js
 * Central constants for Civic Aid backend.
 * Single source of truth — import from here, not from config/constants.js.
 */

export const ROLES = Object.freeze({
  CITIZEN: 'CITIZEN',
  OFFICER: 'OFFICER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
});

export const COMPLAINT_CATEGORIES = Object.freeze([
  'Roads & Potholes',
  'Drainage',
  'Waste Management',
  'Water Supply',
  'Streetlights',
  'Public Facilities',
  'Other'
]);

export const COMPLAINT_STATUS = Object.freeze({
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
});

export const PRIORITY_LEVELS = Object.freeze({
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
});

/**
 * Default SLA windows in hours, keyed by priority level.
 * Priority Formula: 40% Impact + 35% Urgency + 15% Affected Citizens + 10% Duration
 * Scores: 0–30 Low | 31–60 Medium | 61–80 High | 81–100 Critical
 */
export const DEFAULT_SLA_HOURS = Object.freeze({
  Critical: 24,
  High: 48,
  Medium: 72,
  Low: 168
});
