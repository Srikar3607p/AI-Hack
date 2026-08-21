import { Complaint } from '../models/Complaint.js';
import { COMPLAINT_STATUS } from '../config/constants.js';
import { logAuditEvent } from './auditService.js';

export const runEscalationCheck = async () => {
  try {
    const now = new Date();
    // Find active unresolved complaints where deadline has passed
    const overdueComplaints = await Complaint.find({
      status: { $in: [COMPLAINT_STATUS.SUBMITTED, COMPLAINT_STATUS.ASSIGNED, COMPLAINT_STATUS.ACKNOWLEDGED, COMPLAINT_STATUS.IN_PROGRESS, COMPLAINT_STATUS.PENDING] },
      'sla.deadline': { $lt: now }
    });

    let escalatedCount = 0;

    for (const comp of overdueComplaints) {
      const hoursOverdue = (now - comp.sla.deadline) / (1000 * 60 * 60);
      let tier = 'Tier 1 - Ward Field Supervisor';
      if (hoursOverdue > 48 || comp.priority === 'Critical') {
        tier = 'Tier 3 - Department Head & Municipal Commissioner';
      } else if (hoursOverdue > 24 || comp.priority === 'High') {
        tier = 'Tier 2 - Zonal Officer';
      }

      comp.status = COMPLAINT_STATUS.ESCALATED;
      comp.sla.isOverdue = true;
      comp.sla.isApproachingDeadline = false;
      comp.sla.escalatedAt = now;
      comp.sla.escalationTier = tier;
      comp.sla.escalationReason = `Automated SLA breach: Case exceeded target resolution window by ${Math.round(hoursOverdue)} hours.`;

      comp.timeline.push({
        status: COMPLAINT_STATUS.ESCALATED,
        changedByName: 'Escalation Intelligence Agent',
        changedByRole: 'SYSTEM_AGENT',
        timestamp: now,
        notes: `Automated Escalation triggered (${tier}): SLA breached by ${Math.round(hoursOverdue)} hours.`,
        action: 'AUTO_ESCALATED'
      });

      await comp.save();
      escalatedCount++;

      await logAuditEvent({
        action: 'COMPLAINT_AUTO_ESCALATED',
        targetResource: 'Complaint',
        targetId: comp.complaintId,
        details: { hoursOverdue, escalationTier: tier, priority: comp.priority }
      });
    }

    if (escalatedCount > 0) {
      console.log(`[Escalation Engine] Auto-escalated ${escalatedCount} overdue complaints.`);
    }

    return { escalatedCount };
  } catch (error) {
    console.error('[Escalation Engine Error]', error);
    return { error: error.message };
  }
};
