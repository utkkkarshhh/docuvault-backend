const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");
const {
  registerUser,
  userLogin,
  logoutUser,
  forgetPassword,
} = require("../../controllers");

/**
 * @swagger
 *   /api/auth/signup:
 *     post:
 *       summary: User Registration
 *       description: Register a new user by providing email, username, and password.
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: User details for registration
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email of the user.
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 password:
 *                   type: string
 *                   description: The password for the user.
 *                 token:
 *                   type: string
 *                   description: Registration token (should be verified).
 *       responses:
 *         '200':
 *           description: User successfully registered
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   success:
 *                     type: boolean
 *         '400':
 *           description: Bad request (Invalid or missing data)
 *         '401':
 *           description: Unauthorized (Invalid registration token)
 *         '500':
 *           description: Internal server error
 */
router.post("/signup", registerUser);

/**
 * @swagger
 *   /api/auth/signin:
 *     post:
 *       summary: User Login
 *       description: Log in a user using email/username and password.
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: User credentials for login
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 identifier:
 *                   type: string
 *                   description: The email or username of the user.
 *                 password:
 *                   type: string
 *                   description: The password for the user.
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   success:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                         description: User's unique ID
 *                       username:
 *                         type: string
 *                         description: User's username
 *                       email:
 *                         type: string
 *                         description: User's email
 *                   token:
 *                     type: string
 *                     description: JWT token for the session
 *         '400':
 *           description: Bad request (Invalid or missing data)
 *         '401':
 *           description: Unauthorized (Incorrect password)
 *         '404':
 *           description: User not found
 *         '500':
 *           description: Internal server error
 */
router.post("/signin", userLogin);

router.post("/signout", authenticateToken, logoutUser);

/**
 * @swagger
 *   /api/auth/forget_password:
 *     post:
 *       summary: Password Reset Request
 *       description: Request a password reset by providing the email address.
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: User's email for password reset
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email of the user for password reset.
 *       responses:
 *         '200':
 *           description: Password reset email sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   message:
 *                     type: string
 *         '400':
 *           description: Bad request (Invalid email)
 *         '404':
 *           description: User with the given email not found
 *         '500':
 *           description: Internal server error
 */
router.post("/forget_password", forgetPassword);

module.exports = router;
