const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCurrentInventoryReport,
  getLowStockReport,
  getStockInReport,
  getStockOutReport
} = require("../controllers/reportController");

router.use(protect);
router.get("/inventory", getCurrentInventoryReport);
router.get("/low-stock", getLowStockReport);
router.get("/stock-in", getStockInReport);
router.get("/stock-out", getStockOutReport);

module.exports = router;
