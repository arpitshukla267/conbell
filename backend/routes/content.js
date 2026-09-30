const express = require('express');
const router = express.Router();
const ProcessStep = require('../models/ProcessStep');
const QualityPoint = require('../models/QualityPoint');

const getModel = (segment) => {
  if (segment === 'process-steps') return ProcessStep;
  if (segment === 'quality-points') return QualityPoint;
  return null;
};

// Middleware to check segment validity
const checkSegment = (req, res, next) => {
  const model = getModel(req.params.segment);
  if (!model) {
    return res.status(400).json({ success: false, error: 'Invalid segment' });
  }
  req.Model = model;
  next();
};

// GET /api/content/:segment/all
router.get('/:segment/all', checkSegment, async (req, res, next) => {
  try {
    const items = await req.Model.find().sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// GET /api/content/:segment/active
router.get('/:segment/active', checkSegment, async (req, res, next) => {
  try {
    const items = await req.Model.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// POST /api/content/:segment
router.post('/:segment', checkSegment, async (req, res, next) => {
  try {
    const item = await req.Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// PUT /api/content/:segment/:id
router.put('/:segment/:id', checkSegment, async (req, res, next) => {
  try {
    const item = await req.Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/content/:segment/:id/toggle
router.patch('/:segment/:id/toggle', checkSegment, async (req, res, next) => {
  try {
    const item = await req.Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    item.isActive = !item.isActive;
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/content/:segment/:id
router.delete('/:segment/:id', checkSegment, async (req, res, next) => {
  try {
    const item = await req.Model.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
