const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", protect, getProducts);
router.post("/", protect, authorizeRoles("Administrator"), createProduct);
router.put("/:id", protect, authorizeRoles("Administrator"), updateProduct);
router.patch("/:id/deactivate", protect, authorizeRoles("Administrator"), deactivateProduct);
module.exports = router;
