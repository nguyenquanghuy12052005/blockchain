require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend server running on port ${PORT}`);
  });

  // Khởi động event listener ngay sau khi DB đã kết nối
  // Listener lắng nghe events từ Ganache và lưu vào MongoDB
  try {
    require('./listeners/eventListener');
    console.log('✅ Event listener module loaded');
  } catch (err) {
    console.error('⚠️  Event listener không khởi động được:', err.message);
    console.error('   → Kiểm tra Ganache có đang chạy tại', process.env.GANACHE_RPC_URL);
    // Không exit — API vẫn hoạt động bình thường, chỉ mất tính năng auto-sync on-chain
  }
});