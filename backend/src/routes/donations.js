/**
 * Donation Routes
 * GET  /api/donations
 * POST /api/donations
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { isUsingFallback, jsonStore } = require('../db');
const { authenticateToken } = require('../middleware/auth');
let Donation;
try { Donation = require('../models/Donation'); } catch {}

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    if (isUsingFallback()) {
      let donations = jsonStore.get('donations');
      if (type) donations = donations.filter(d => d.type === type);
      return res.json(donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    const query = type ? { type } : {};
    const donations = await Donation.find(query).sort({ createdAt: -1 }).lean();
    return res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { donorName, type, amount, upiRef, pickupAddress, itemCount, condition, supportRequestId, message } = req.body;
    if (!donorName || !type) return res.status(400).json({ error: 'donorName and type required' });
    if (isUsingFallback()) {
      const item = { _id: uuidv4(), donorName, type, amount, upiRef, pickupAddress, itemCount, condition, supportRequestId, message, createdAt: new Date().toISOString() };
      jsonStore.add('donations', item);
      return res.status(201).json(item);
    }
    const item = await Donation.create({ donorName, type, amount, upiRef, pickupAddress, itemCount, condition, supportRequestId, message });
    return res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
