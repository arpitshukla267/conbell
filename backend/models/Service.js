const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['conveyor', 'assembly', 'platform', 'fabrication'], 
    required: true 
  },
  badge: String,
  title: { type: String, required: true },
  shortTitle: String,
  description: String,
  contribution: String,
  specs: [{ label: String, value: String }],
  image: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
