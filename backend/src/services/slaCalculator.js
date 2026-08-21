import { DEFAULT_SLA_HOURS } from '../config/constants.js';

export const calculateSLA = (priority, department = null) => {
  let targetHours = DEFAULT_SLA_HOURS[priority] || 72;

  if (department && department.slaHours && department.slaHours[priority]) {
    targetHours = department.slaHours[priority];
  }

  const deadline = new Date(Date.now() + targetHours * 60 * 60 * 1000);

  return {
    targetResolutionHours: targetHours,
    deadline,
    isApproachingDeadline: false,
    isOverdue: false
  };
};

export const checkSLAStatus = (complaint) => {
  if (!complaint.sla || !complaint.sla.deadline) {
    return { isApproachingDeadline: false, isOverdue: false, hoursRemaining: 0, percentElapsed: 0 };
  }

  const now = new Date();
  const createdAt = new Date(complaint.createdAt || Date.now());
  const deadline = new Date(complaint.sla.deadline);

  const totalDurationMs = deadline.getTime() - createdAt.getTime();
  const elapsedMs = now.getTime() - createdAt.getTime();
  const percentElapsed = totalDurationMs > 0 ? (elapsedMs / totalDurationMs) * 100 : 100;
  const hoursRemaining = Math.max(0, (deadline.getTime() - now.getTime()) / (1000 * 60 * 60));

  const isOverdue = now > deadline;
  const isApproachingDeadline = !isOverdue && percentElapsed >= 75;

  return {
    isApproachingDeadline,
    isOverdue,
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    percentElapsed: Math.round(percentElapsed)
  };
};
