const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve user accounts
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users in the system
 *   post:
 *     summary: Create Staff account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Staff Member
 *               username:
 *                 type: string
 *                 example: staffuser
 *               password:
 *                 type: string
 *                 example: staff123
 *               role:
 *                 type: string
 *                 enum: [Administrator, Staff]
 *                 default: Staff
 *                 example: Staff
 *     responses:
 *       201:
 *         description: Staff account created successfully
 *       400:
 *         description: Validation failed or username already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/", getUsers);
router.post("/", protect, adminOnly, createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Updated Staff Member
 *               username:
 *                 type: string
 *                 example: staffuser_updated
 *               role:
 *                 type: string
 *                 enum: [Administrator, Staff]
 *                 example: Staff
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: Active
 *     responses:
 *       200:
 *         description: User account updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put("/:id", protect, adminOnly, updateUser);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB user ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.patch("/:id/deactivate", protect, adminOnly, deactivateUser);

module.exports = router;

