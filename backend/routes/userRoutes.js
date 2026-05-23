const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getUsers); // Made public to easily prove database connection in the browser
router.post("/", protect, adminOnly, createUser);
router.put("/:id", protect, adminOnly, updateUser);
router.patch("/:id/deactivate", protect, adminOnly, deactivateUser);
module.exports = router;
