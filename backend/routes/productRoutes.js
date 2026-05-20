const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getProducts);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.patch("/:id/deactivate", protect, adminOnly, deactivateProduct);
module.exports = router;
