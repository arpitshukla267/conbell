const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  location: { type: String, default: 'Kalol, Gujarat (On-site)' },
  type: { type: String, default: 'Full-time' },
  experience: { type: String, default: '2-5 Years' },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
