/**
 * Support Request Routes
 * GET  /api/support-requests
 * POST /api/support-requests
 * PATCH /api/support-requests/:id/status
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { isUsingFallback, jsonStore } = require('../db');
let SupportRequest;
try { SupportRequest = require('../models/SupportRequest'); } catch {}

router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    if (isUsingFallback()) {
      let reqs = jsonStore.get('supportRequests');
      if (category) reqs = reqs.filter(r => r.category === category);
      if (status) reqs = reqs.filter(r => r.status === status);
      return res.json(reqs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    const reqs = await SupportRequest.find(query).sort({ createdAt: -1 }).lean();
    return res.json(reqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { requesterName, village, district, state, category, description, amountNeeded, contactPhone } = req.body;
    if (!requesterName || !category || !description) return res.status(400).json({ error: 'requesterName, category, description required' });
    if (isUsingFallback()) {
      const item = { _id: uuidv4(), requesterName, village, district, state, category, description, amountNeeded, contactPhone, status: 'PENDING', verifiedByVolunteer: false, createdAt: new Date().toISOString() };
      jsonStore.add('supportRequests', item);
      return res.status(201).json(item);
    }
    const item = await SupportRequest.create({ requesterName, village, district, state, category, description, amountNeeded, contactPhone });
    return res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (isUsingFallback()) {
      const updated = jsonStore.update('supportRequests', req.params.id, { status });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.json(updated);
    }
    const updated = await SupportRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
