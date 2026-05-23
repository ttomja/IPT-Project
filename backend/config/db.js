const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't call process.exit(1) on Vercel to allow subsequent retries
    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw error;
    }
  }
}
module.exports = connectDB;
