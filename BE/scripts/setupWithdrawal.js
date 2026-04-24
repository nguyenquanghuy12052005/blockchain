require('dotenv').config();
const connectDB = require('../config/db');
const Withdrawal = require('../models/Withdrawal');

const setupWithdrawal = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();

    // Tạo một document mẫu để tự động tạo collection
    const sampleWithdrawal = new Withdrawal({
      transactionHash: '0xsamplehash123456789',
      campaignId: 1,
      withdrawer: '0x123456789abcdef',
      displayName: 'Người rút mẫu',
      amount: '1000000000000000000', // 1 ETH in wei
      amountEth: 1,
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Rút tiền mẫu để tạo collection',
      status: 'confirmed',
    });

    // Lưu document, điều này sẽ tạo collection nếu chưa có
    await sampleWithdrawal.save();
    console.log('Collection Withdrawal đã được tạo và document mẫu đã được thêm.');

    // Đóng kết nối
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi setup Withdrawal:', error);
    process.exit(1);
  }
};

setupWithdrawal();