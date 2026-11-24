const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  village: String,
  district: String,
  state: String,
  category: { type: String, enum: ['FINANCIAL', 'EDUCATION', 'HEALTH'], required: true },
  description: { type: String, required: true },
  amountNeeded: Number,
  status: { type: String, enum: ['PENDING', 'IN_REVIEW', 'FULFILLED', 'CLOSED'], default: 'PENDING' },
  contactPhone: String,
  verifiedByVolunteer: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
