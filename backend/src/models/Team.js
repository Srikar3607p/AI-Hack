import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  zone: {
    type: String,
    default: 'Central Zone'
  },
  ward: {
    type: String,
    default: 'Ward 1'
  },
  leadOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Team = mongoose.model('Team', teamSchema);
