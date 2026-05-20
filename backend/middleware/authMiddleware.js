const jwt = require("jsonwebtoken");
const User = require("../models/User");
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. Token missing." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.status !== "Active") {
      return res.status(401).json({ message: "User is not authorized." });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized. Token invalid." });
  }
}
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "Administrator") {
    return res.status(403).json({ message: "Access denied. Administrator only." });
  }
  next();
};
module.exports = { protect, adminOnly };
