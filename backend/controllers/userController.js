const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users.", error: error.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { fullName, username, password } = req.body;

    if (!fullName || !username || !password) {
      return res.status(400).json({
        message: "Full name, username, and password are required."
      });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const user = await User.create({
      fullName,
      username,
      password,
      role: "Staff",
      accountStatus: "Active"
    });

    res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      accountStatus: user.accountStatus
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create staff.", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, role, accountStatus } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (role !== undefined) user.role = role;
    if (accountStatus !== undefined) user.accountStatus = accountStatus;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      role: updatedUser.role,
      accountStatus: updatedUser.accountStatus
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user.", error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.accountStatus = "Inactive";
    await user.save();

    res.json({ message: "User deactivated successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Failed to deactivate user.",
      error: error.message
    });
  }
};
