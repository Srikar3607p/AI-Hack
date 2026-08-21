import mongoose from 'mongoose';
import { CATEGORIES, COMPLAINT_STATUS, PRIORITY_LEVELS } from '../config/constants.js';

const timelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  changedByName: {
    type: String,
    default: 'Civic Aid System'
  },
  changedByRole: {
    type: String,
    default: 'SYSTEM'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    default: 'STATUS_UPDATE'
  }
}, { _id: true });

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  voiceTranscript: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [77.5946, 12.9716] // Default Bangalore center coordinates
    },
    address: {
      type: String,
      default: 'Location specified on civic map'
    },
    ward: {
      type: String,
      default: 'Ward 12'
    },
    zone: {
      type: String,
      default: 'Central Zone'
    }
  },
  category: {
    type: String,
    enum: CATEGORIES,
    default: 'Other',
    index: true
  },
  issueType: {
    type: String,
    default: 'Civic Grievance'
  },
  priority: {
    type: String,
    enum: Object.values(PRIORITY_LEVELS),
    default: PRIORITY_LEVELS.MEDIUM,
    index: true
  },
  priorityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  priorityFactors: {
    impact: { type: Number, default: 50 },
    urgency: { type: Number, default: 50 },
    affectedCitizens: { type: Number, default: 50 },
    duration: { type: Number, default: 20 }
  },
  priorityExplanation: {
    type: String,
    default: 'Medium priority based on municipal risk assessment.'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    index: true,
    default: null
  },
  assignedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: Object.values(COMPLAINT_STATUS),
    default: COMPLAINT_STATUS.SUBMITTED,
    index: true
  },
  sla: {
    targetResolutionHours: { type: Number, default: 72 },
    deadline: { type: Date },
    isApproachingDeadline: { type: Boolean, default: false },
    isOverdue: { type: Boolean, default: false },
    escalatedAt: { type: Date, default: null },
    escalationTier: { type: String, default: null },
    escalationReason: { type: String, default: '' }
  },
  aiAnalysis: {
    summary: { type: String, default: '' },
    safetyRisk: { type: String, default: 'Low' },
    confidenceScore: { type: Number, default: 0.85 },
    detectedLabels: [{ type: String }],
    isAiAssisted: { type: Boolean, default: true },
    analysisType: {
      type: String,
      enum: ['AI-assisted', 'Fallback analysis'],
      default: 'AI-assisted'
    },
    duplicateInfo: {
      isDuplicate: { type: Boolean, default: false },
      similarityScore: { type: Number, default: 0 },
      relatedComplaintId: { type: String, default: null },
      explanation: { type: String, default: '' }
    }
  },
  resolution: {
    resolutionNotes: { type: String, default: '' },
    beforeImages: [{ type: String }],
    afterImages: [{ type: String }],
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolvedAt: { type: Date, default: null },
    aiVerification: {
      verified: { type: Boolean, default: false },
      confidence: { type: Number, default: 0 },
      notes: { type: String, default: '' }
    },
    citizenExplanation: { type: String, default: '' }
  },
  reopened: {
    isReopened: { type: Boolean, default: false },
    reopenedAt: { type: Date, default: null },
    reopenCount: { type: Number, default: 0 },
    reopenReason: { type: String, default: '' },
    reopenedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  timeline: [timelineEventSchema]
}, {
  timestamps: true
});

complaintSchema.index({ 'location.coordinates': '2dsphere' });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });

export const Complaint = mongoose.model('Complaint', complaintSchema);
