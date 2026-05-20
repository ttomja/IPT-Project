const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

router.use(protect);
router.use(authorizeRoles("Administrator"));
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id/deactivate", deactivateUser);
module.exports = router;
