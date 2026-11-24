const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  type: { type: String, enum: ['MONEY', 'CLOTHES'], required: true },
  // Money fields
  amount: Number,
  upiRef: String,
  // Clothes fields
  pickupAddress: String,
  itemCount: Number,
  condition: { type: String, enum: ['NEW', 'GOOD', 'FAIR'] },
  // Linked request
  supportRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportRequest' },
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
