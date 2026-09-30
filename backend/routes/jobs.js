const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/jobs
router.get('/', async (req, res, next) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const jobs = await Job.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/all
router.get('/all', async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/active
router.get('/active', async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job vacancy not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

// POST /api/jobs
router.post('/', async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

// PUT /api/jobs/:id
router.put('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job vacancy not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/jobs/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job vacancy not found' });
    }
    job.isActive = !job.isActive;
    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job vacancy not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
