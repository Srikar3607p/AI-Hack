import { AuditLog } from '../models/AuditLog.js';

export const logAuditEvent = async ({
  action,
  user = null,
  targetResource = 'Complaint',
  targetId = '',
  details = {},
  ipAddress = '127.0.0.1'
}) => {
  try {
    await AuditLog.create({
      action,
      performedBy: user?._id || null,
      performerName: user?.name || 'SYSTEM',
      performerRole: user?.role || 'SYSTEM',
      targetResource,
      targetId: String(targetId),
      details,
      ipAddress
    });
  } catch (error) {
    console.error('[Audit Log Error]', error.message);
  }
};
