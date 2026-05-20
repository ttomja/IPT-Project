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
/**
 * @swagger
 * /reports/inventory:
 *   get:
 *     summary: Get current inventory report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active inventory products
 */
router.get("/inventory", getCurrentInventoryReport);
/**
 * @swagger
 * /reports/low-stock:
 *   get:
 *     summary: Get low-stock report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products at or below reorder level
 */
router.get("/low-stock", getLowStockReport);
/**
 * @swagger
 * /reports/stock-in:
 *   get:
 *     summary: Get stock-in transaction report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stock-in transactions
 */
router.get("/stock-in", getStockInReport);
/**
 * @swagger
 * /reports/stock-out:
 *   get:
 *     summary: Get stock-out transaction report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stock-out transactions
 */
router.get("/stock-out", getStockOutReport);

module.exports = router;
