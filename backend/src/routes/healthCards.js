/**
 * Health Cards Routes: GET /api/health-cards
 */
const express = require('express');
const router = express.Router();
const { isUsingFallback, jsonStore } = require('../db');
let HealthCard;
try { HealthCard = require('../models/HealthCard'); } catch {}

router.get('/', async (req, res) => {
  try {
    const { ageGroup } = req.query;
    if (isUsingFallback()) {
      let cards = jsonStore.get('healthCards');
      if (ageGroup) cards = cards.filter(c => c.ageGroup === ageGroup);
      return res.json(cards);
    }
    const query = ageGroup ? { ageGroup } : {};
    const cards = await HealthCard.find(query).lean();
    return res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
