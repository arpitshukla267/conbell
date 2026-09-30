const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET /api/services
router.get('/', async (req, res, next) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/all
router.get('/all', async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/active
router.get('/active', async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// POST /api/services
router.post('/', async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/:id
router.put('/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/services/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/services/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
