const mongoose = require('mongoose');

const historyItemSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  fromStatus: {
    type: String,
  },
  toStatus: {
    type: String,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  email: {
    to: String,
    subject: String,
    body: String,
    hasAttachment: Boolean,
    attachmentName: String,
    attachmentUrl: String,
    messageId: String,
    sentAt: Date,
  },
  performedBy: {
    type: String,
    default: 'Admin',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  jobTitle: { type: String, required: true },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  message: { type: String, default: '' },
  experience: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'pending',
      'reviewed',
      'shortlisted',
      'interview',
      'interview_taken',
      'hired',
      'accepted',
      'rejected',
    ],
    default: 'pending',
  },
  interviewDetails: {
    date: { type: String },
    time: { type: String },
    mode: { type: String, default: 'Online' },
    location: { type: String }, // meeting link or physical location
    notes: { type: String },
    scheduledAt: { type: Date },
    scheduledBy: { type: String, default: 'Admin' },
  },
  hiringDetails: {
    hiredAt: { type: Date },
    hiredBy: { type: String, default: 'Admin' },
    offerLetterUrl: { type: String },
    offerLetterName: { type: String },
  },
  history: [historyItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
