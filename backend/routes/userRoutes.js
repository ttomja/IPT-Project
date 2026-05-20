const express = require("express");
const {
  getUsers,
  createStaff,
  updateUser,
  deactivateUser
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("Admin"));

router.get("/", getUsers);
router.post("/staff", createStaff);
router.put("/:id", updateUser);
router.patch("/:id/deactivate", deactivateUser);

module.exports = router;
