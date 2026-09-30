const mongoose = require('mongoose');

const processStepSchema = new mongoose.Schema({
  number: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  highlights: [String],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ProcessStep', processStepSchema);
