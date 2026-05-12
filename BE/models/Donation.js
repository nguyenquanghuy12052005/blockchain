const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true, unique: true },
  campaignId:      { type: Number, required: true },
  donor:           { type: String, required: true },       // địa chỉ ví 0x...
  displayName:     { type: String, default: '' },          // tên hiển thị tùy chọn
  amount:          { type: String, required: true },       // wei dạng string
  amountEth:       { type: Number, default: 0 },           // ETH dạng số để dễ hiển thị
  timestamp:       { type: Number, required: true },       // unix timestamp
  message:         { type: String, default: '' },          // lời nhắn
  status: {
    type:    String,
    enum:    ['pending', 'confirmed'],
    default: 'pending',
    // pending  = FE đã gửi lên nhưng chưa có event từ blockchain
    // confirmed = event Donated đã được listener bắt và xác nhận
  },
}, { timestamps: true });

module.exports = mongoose.model('donations', DonationSchema);