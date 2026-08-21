import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  categories: [{
    type: String
  }],
  headOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  slaHours: {
    Critical: { type: Number, default: 24 },
    High: { type: Number, default: 48 },
    Medium: { type: Number, default: 72 },
    Low: { type: Number, default: 168 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Department = mongoose.model('Department', departmentSchema);
