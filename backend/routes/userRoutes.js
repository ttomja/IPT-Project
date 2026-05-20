const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);
router.use(adminOnly);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id/deactivate", deactivateUser);
module.exports = router;
