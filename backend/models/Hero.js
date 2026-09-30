const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  accentHeading: String,
  subtext: String,
  imageDesktop: String,
  imageMobile: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
