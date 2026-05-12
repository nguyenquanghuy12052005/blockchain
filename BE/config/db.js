

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Thêm các options để kết nối ổn định hơn
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, 
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    // Thoát tiến trình với mã lỗi 1
    process.exit(1);
  }
};

module.exports = connectDB;