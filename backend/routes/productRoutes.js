const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve product records
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query (checks code and name)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter products by category ID
 *     responses:
 *       200:
 *         description: List of active products matching filters
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create product record
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productCode
 *               - productName
 *               - categoryId
 *               - unitOfMeasure
 *             properties:
 *               productCode:
 *                 type: string
 *                 example: PROD-001
 *               productName:
 *                 type: string
 *                 example: Wireless Keyboard
 *               categoryId:
 *                 type: string
 *                 description: MongoDB ID of the category
 *                 example: 60b8d29f1c1f2e1a38b1f5d2
 *               description:
 *                 type: string
 *                 example: Ergonomic Bluetooth wireless keyboard
 *               unitOfMeasure:
 *                 type: string
 *                 example: Pieces
 *               quantityInStock:
 *                 type: number
 *                 default: 0
 *                 example: 50
 *               reorderLevel:
 *                 type: number
 *                 default: 0
 *                 example: 10
 *               price:
 *                 type: number
 *                 default: 0
 *                 example: 29.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation failed, negative numeric values, or code already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/", protect, getProducts);
router.post("/", protect, adminOnly, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product record
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productCode:
 *                 type: string
 *                 example: PROD-001-REV
 *               productName:
 *                 type: string
 *                 example: Wireless Mechanical Keyboard
 *               categoryId:
 *                 type: string
 *                 example: 60b8d29f1c1f2e1a38b1f5d2
 *               description:
 *                 type: string
 *                 example: Updated description for wireless keyboard
 *               unitOfMeasure:
 *                 type: string
 *                 example: Units
 *               quantityInStock:
 *                 type: number
 *                 example: 45
 *               reorderLevel:
 *                 type: number
 *                 example: 5
 *               price:
 *                 type: number
 *                 example: 34.99
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Duplicate product code or negative values
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put("/:id", protect, adminOnly, updateProduct);

/**
 * @swagger
 * /products/{id}/deactivate:
 *   patch:
 *     summary: Deactivate product record
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB product ID
 *     responses:
 *       200:
 *         description: Product deactivated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.patch("/:id/deactivate", protect, adminOnly, deactivateProduct);

module.exports = router;

