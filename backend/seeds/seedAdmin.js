require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const existingAdmin = await User.findOne({ username: "admin" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      fullName: "System Administrator",
      username: "admin",
      password: hashedPassword,
      role: "Administrator",
      status: "Active",
    });
    console.log("Admin account created.");
  } else {
    console.log("Admin account already exists.");
  }
  await mongoose.disconnect();
}
seedAdmin();
