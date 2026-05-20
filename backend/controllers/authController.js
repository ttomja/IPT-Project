const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase(),
      accountStatus: "Active"
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const passwordMatches = await user.matchPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        accountStatus: user.accountStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      role: req.user.role,
      accountStatus: req.user.accountStatus
    }
  });
};
