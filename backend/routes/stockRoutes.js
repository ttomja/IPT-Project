const express = require("express");
const {
  stockIn,
  stockOut,
  getTransactions,
} = require("../controllers/stockController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /stock/in:
 *   post:
 *     summary: Record stock-in transaction
 *     tags: [Stock Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: MongoDB product ID to stock in
 *                 example: 60b8d29f1c1f2e1a38b1f5d2
 *               quantity:
 *                 type: number
 *                 example: 100
 *               remarks:
 *                 type: string
 *                 example: Restock from supplier shipment
 *     responses:
 *       201:
 *         description: Stock-in recorded successfully
 *       400:
 *         description: Validation failed (quantity must be > 0)
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.post("/in", stockIn);

/**
 * @swagger
 * /stock/out:
 *   post:
 *     summary: Record stock-out transaction
 *     tags: [Stock Operations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: MongoDB product ID to stock out
 *                 example: 60b8d29f1c1f2e1a38b1f5d2
 *               quantity:
 *                 type: number
 *                 example: 5
 *               remarks:
 *                 type: string
 *                 example: Order fulfillment #1032
 *     responses:
 *       201:
 *         description: Stock-out transaction recorded successfully
 *       400:
 *         description: Insufficient stock or negative values
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.post("/out", stockOut);

/**
 * @swagger
 * /stock/transactions:
 *   get:
 *     summary: Retrieve transaction history
 *     tags: [Stock Operations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [All, Stock In, Stock Out]
 *         description: Filter by type of transaction
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by specific product ID
 *     responses:
 *       200:
 *         description: List of transactions matching search filters
 *       401:
 *         description: Unauthorized
 */
router.get("/transactions", getTransactions);

module.exports = router;

