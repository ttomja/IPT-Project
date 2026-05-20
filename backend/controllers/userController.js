const bcrypt = require("bcryptjs");
const User = require("../models/User");
async function getUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}
async function createUser(req, res) {
  const { fullName, username, password, role } = req.body;
  if (!fullName || !username || !password) {
    return res.status(400).json({ message: "Full name, username, and password are required." });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    username,
    password: hashedPassword,
    role: role || "Staff",
  });
  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    status: user.status,
  });
}
async function updateUser(req, res) {
  const { fullName, username, role, status } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  user.fullName = fullName ?? user.fullName;
  user.username = username ?? user.username;
  user.role = role ?? user.role;
  user.status = status ?? user.status;
  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    fullName: updatedUser.fullName,
    username: updatedUser.username,
    role: updatedUser.role,
    status: updatedUser.status,
  });
}
async function deactivateUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  user.status = "Inactive";
  await user.save();
  res.json({ message: "User deactivated successfully." });
}
module.exports = {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
};
