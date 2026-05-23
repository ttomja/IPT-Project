const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve product categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active categories
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create product category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Devices, gadgets, and accessories
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation failed or category already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/", protect, getCategories);
router.post("/", protect, adminOnly, createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update product category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: Home Appliances
 *               description:
 *                 type: string
 *                 example: Electronic items for household use
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put("/:id", protect, adminOnly, updateCategory);

module.exports = router;

