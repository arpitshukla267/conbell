const mongoose = require('mongoose');

const qualityPointSchema = new mongoose.Schema({
  number: String,
  title: { type: String, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('QualityPoint', qualityPointSchema);
