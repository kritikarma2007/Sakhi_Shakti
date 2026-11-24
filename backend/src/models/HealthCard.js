const mongoose = require('mongoose');

const healthCardSchema = new mongoose.Schema({
  ageGroup: {
    type: String,
    enum: ['0-12', '13-19', '20-35', '36-50', '50+'],
    required: true
  },
  title: { en: String, hi: String },
  icon: String,
  color: String,
  symptoms: [{ en: String, hi: String }],
  prevention: [{ en: String, hi: String }],
  homeRemedies: [{ en: String, hi: String }],
  redFlags: [{ en: String, hi: String }],
  conditions: [{ en: String, hi: String }]
}, { timestamps: true });

module.exports = mongoose.model('HealthCard', healthCardSchema);
