const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", protect, getCategories);
router.post("/", protect, authorizeRoles("Administrator"), createCategory);
router.put("/:id", protect, authorizeRoles("Administrator"), updateCategory);
module.exports = router;
