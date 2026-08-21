import mongoose from 'mongoose';

const complaintClusterSchema = new mongoose.Schema({
  clusterId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number], // [lon, lat]
    required: true
  },
  radiusMeters: {
    type: Number,
    default: 250
  },
  complaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  complaintCount: {
    type: Number,
    default: 1
  },
  severity: {
    type: String,
    enum: ['Moderate', 'High', 'Critical Chronic'],
    default: 'Moderate'
  },
  dateRange: {
    start: { type: Date, default: Date.now },
    end: { type: Date, default: Date.now }
  },
  affectedCitizensEstimate: {
    type: Number,
    default: 150
  },
  ward: {
    type: String,
    default: 'Ward 12'
  },
  status: {
    type: String,
    enum: ['Active Recurring', 'Monitoring', 'Mitigated / Under Civic Review'],
    default: 'Active Recurring'
  },
  mitigationNotes: {
    type: String,
    default: 'Identified through geographic spatial clustering algorithm.'
  }
}, {
  timestamps: true
});

complaintClusterSchema.index({ coordinates: '2dsphere' });

export const ComplaintCluster = mongoose.model('ComplaintCluster', complaintClusterSchema);
