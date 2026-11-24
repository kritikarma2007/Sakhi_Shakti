const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { en: String, hi: String },
  level: { type: String, enum: ['CENTRAL', 'STATE'], required: true },
  state: { type: String, default: 'All India' },
  category: { type: String, enum: ['Health', 'Financial', 'Education', 'Employment'] },
  description: { en: String, hi: String },
  eligibility: {
    minAge: Number,
    maxAge: Number,
    maxIncomeLPA: Number,
    criteria: [{ en: String, hi: String }]
  },
  benefits: [{ en: String, hi: String }],
  documents: [{ en: String, hi: String }],
  applySteps: [{ en: String, hi: String }],
  officialLink: String,
  icon: String,
  color: String
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
