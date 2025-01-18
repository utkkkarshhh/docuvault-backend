const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController/authController");
const authenticateToken = require("../../middlewares/authenticateToken");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *               token:
 *                 type: string
 *                 example: your_registration_token
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input data
 *                 success:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Invalid registration token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *                 success:
 *                   type: boolean
 *                   example: false
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.post("/signup", authController.registerUser);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Authenticate a user and get a token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: Username or Email
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Sign-in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign-in successful
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/signin", authController.loginUser);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Sign out a user by invalidating their token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sign-out successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signed out successfully
 *       401:
 *         description: Invalid or missing token
 */
router.post("/signout", authenticateToken, authController.logoutUser);

module.exports = router;
