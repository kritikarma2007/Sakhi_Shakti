/**
 * Schemes Routes: GET /api/schemes
 */
const express = require('express');
const router = express.Router();
const { isUsingFallback, jsonStore } = require('../db');
let Scheme;
try { Scheme = require('../models/Scheme'); } catch {}

router.get('/', async (req, res) => {
  try {
    const { level, state, category, minAge, maxAge, maxIncome } = req.query;
    if (isUsingFallback()) {
      let schemes = jsonStore.get('schemes');
      if (level) schemes = schemes.filter(s => s.level === level);
      if (state && state !== 'All') schemes = schemes.filter(s => s.state === state || s.state === 'All India');
      if (category) schemes = schemes.filter(s => s.category === category);
      if (minAge) schemes = schemes.filter(s => !s.eligibility?.maxAge || s.eligibility.maxAge >= parseInt(minAge));
      if (maxAge) schemes = schemes.filter(s => !s.eligibility?.minAge || s.eligibility.minAge <= parseInt(maxAge));
      if (maxIncome) schemes = schemes.filter(s => !s.eligibility?.maxIncomeLPA || s.eligibility.maxIncomeLPA >= parseFloat(maxIncome));
      return res.json(schemes);
    }
    const query = {};
    if (level) query.level = level;
    if (state && state !== 'All') query.$or = [{ state }, { state: 'All India' }];
    if (category) query.category = category;
    const schemes = await Scheme.find(query).lean();
    return res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
