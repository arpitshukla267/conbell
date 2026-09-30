const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// GET /api/hero/all
router.get('/all', async (req, res, next) => {
  try {
    const heroes = await Hero.find().sort({ order: 1 });
    res.json({ success: true, data: heroes });
  } catch (error) {
    next(error);
  }
});

// GET /api/hero/active
router.get('/active', async (req, res, next) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: heroes });
  } catch (error) {
    next(error);
  }
});

// POST /api/hero
router.post('/', async (req, res, next) => {
  try {
    const hero = await Hero.create(req.body);
    res.status(201).json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
});

// PUT /api/hero/:id
router.put('/:id', async (req, res, next) => {
  try {
    const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!hero) {
      return res.status(404).json({ success: false, error: 'Hero not found' });
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/hero/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, error: 'Hero not found' });
    }
    hero.isActive = !hero.isActive;
    await hero.save();
    res.json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/hero/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, error: 'Hero not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
