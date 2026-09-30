const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const products = await Product.find(filter).sort({ order: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/all
router.get('/all', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ order: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/active
router.get('/active', async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    let product = await Product.findOne({ slug: req.params.slug });
    
    if (!product && mongoose.Types.ObjectId.isValid(req.params.slug)) {
      product = await Product.findById(req.params.slug);
    }
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/products/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    product.isActive = !product.isActive;
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
