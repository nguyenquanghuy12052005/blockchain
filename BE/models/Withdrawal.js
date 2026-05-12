const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true, unique: true },
  campaignId:      { type: Number, required: true },      // ID của campaign từ on-chain
  withdrawer:      { type: String, required: true },      // địa chỉ ví người rút tiền 0x...
  displayName:     { type: String, default: '' },         // tên hiển thị tùy chọn
  amount:          { type: String, required: true },      // số wei dạng string
  amountEth:       { type: Number, default: 0 },          // ETH dạng số để dễ hiển thị
  timestamp:       { type: Number, required: true },      // unix timestamp
  message:         { type: String, default: '' },         // lời nhắn hoặc lý do rút tiền
  status: {
    type:    String,
    enum:    ['pending', 'confirmed'],
    default: 'pending',
    // pending  = đã gửi lên nhưng chưa có event từ blockchain
    // confirmed = event Withdrawal đã được listener bắt và xác nhận
  },
}, { timestamps: true });

module.exports = mongoose.model('withdrawals', WithdrawalSchema);