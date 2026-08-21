import mongoose from 'mongoose';

const escalationRuleSchema = new mongoose.Schema({
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    required: true,
    unique: true
  },
  slaHours: {
    type: Number,
    required: true
  },
  warningThresholdPercent: {
    type: Number,
    default: 75 // Alert when 75% of SLA elapsed
  },
  autoEscalate: {
    type: Boolean,
    default: true
  },
  escalationTier1Hours: {
    type: Number,
    default: 0 // Immediate on breach
  },
  escalationTier2Hours: {
    type: Number,
    default: 24 // 24h past SLA
  },
  escalationTier3Hours: {
    type: Number,
    default: 48 // 48h past SLA
  },
  notificationRole: {
    type: String,
    default: 'ADMIN'
  }
}, {
  timestamps: true
});

export const EscalationRule = mongoose.model('EscalationRule', escalationRuleSchema);
