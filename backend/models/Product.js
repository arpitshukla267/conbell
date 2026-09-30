const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['conveyor', 'structural', 'safety', 'fabrication', 'project'], 
    required: true 
  },
  badge: String,
  description: String,
  longDescription: String,
  features: [String],
  image: String,
  gallery: [String],
  specs: [{ label: String, value: String }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
