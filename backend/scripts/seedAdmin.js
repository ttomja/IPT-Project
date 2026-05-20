const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    await User.create({
      fullName: "System Administrator",
      username: "admin",
      password: "admin123",
      role: "Admin",
      accountStatus: "Active"
    });

    console.log("Admin account created successfully.");
    console.log("Username: admin");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
