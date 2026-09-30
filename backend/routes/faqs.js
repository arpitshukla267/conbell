const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');

// GET /api/faqs/all
router.get('/all', async (req, res, next) => {
  try {
    const faqs = await Faq.find().sort({ order: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
});

// GET /api/faqs/active
router.get('/active', async (req, res, next) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
});

// POST /api/faqs
router.post('/', async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
});

// PUT /api/faqs/:id
router.put('/:id', async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/faqs/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }
    faq.isActive = !faq.isActive;
    await faq.save();
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/faqs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
