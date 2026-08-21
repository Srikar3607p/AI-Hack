import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    index: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  performerName: {
    type: String,
    default: 'SYSTEM'
  },
  performerRole: {
    type: String,
    default: 'SYSTEM'
  },
  targetResource: {
    type: String,
    default: 'Complaint'
  },
  targetId: {
    type: String,
    default: ''
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
