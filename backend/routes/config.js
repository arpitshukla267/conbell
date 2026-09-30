const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');

// GET /api/content/config
router.get('/', async (req, res, next) => {
  try {
    const configs = await SiteConfig.find();
    const configMap = {};
    configs.forEach(conf => {
      configMap[conf.key] = conf.value;
    });
    res.json({ success: true, data: configMap });
  } catch (error) {
    next(error);
  }
});

// PUT /api/content/config/:key
router.put('/:key', async (req, res, next) => {
  try {
    if (req.body.value === undefined) {
      return res.status(400).json({ success: false, error: 'Value is required' });
    }
    const config = await SiteConfig.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
