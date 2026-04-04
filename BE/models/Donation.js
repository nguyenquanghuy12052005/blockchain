const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true, unique: true },
  campaignId: { type: Number, required: true },
  donor: { type: String, required: true },
  amount: { type: String, required: true }, // wei
  amountEth: { type: Number },
  timestamp: { type: Number, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);