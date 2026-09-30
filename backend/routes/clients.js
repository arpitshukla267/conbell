const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// GET /api/clients/all
router.get('/all', async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ order: 1 });
    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
});

// GET /api/clients/active
router.get('/active', async (req, res, next) => {
  try {
    const clients = await Client.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
});

// POST /api/clients
router.post('/', async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// PUT /api/clients/:id
router.put('/:id', async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/clients/:id/toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    client.isActive = !client.isActive;
    await client.save();
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/clients/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
