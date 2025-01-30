const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");
const {
  getUserLoginDetails,
  updatePassword,
  updateUserLogin,
  getUserDetails,
  updateUserDetail,
  getAllUsers,
  deleteUser,
} = require("../../controllers");

// User Routes

/**
 * @swagger
 * /api/users/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetches all registered users from the system. Requires authentication via Bearer Token.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "No users found."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.get("/users", authenticateToken, getAllUsers);

/**
 * @swagger
 * /api/users/userDetail/{user_id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     description: Fetches details of a specific user using their unique user ID (UUID). Requires authentication via Bearer Token.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Unique User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: "1990-05-20"
 *                     bio:
 *                       type: string
 *                       example: "Software developer with a passion for AI."
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-08-01T12:34:56Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-08-20T14:45:30Z"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No user found with the given ID."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.get("/userDetail/:user_id", authenticateToken, getUserDetails);

/**
 * @swagger
 * /api/users/updateUserDetail/{user_id}:
 *   put:
 *     summary: Update user details
 *     description: Updates a user's details (name, bio, or date of birth) by their user ID (UUID). Requires authentication via Bearer Token.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Unique User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               bio:
 *                 type: string
 *                 example: "Software engineer and AI enthusiast."
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *             example:
 *               name: "John Doe"
 *               bio: "Software engineer and AI enthusiast."
 *               dob: "1990-05-20"
 *     responses:
 *       200:
 *         description: User details successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User details updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     bio:
 *                       type: string
 *                       example: "Software engineer and AI enthusiast."
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: "1990-05-20"
 *       400:
 *         description: Bad Request - At least one field is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "At least one field (name, bio, or dob) is required."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No user found with the given ID."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.put("/updateUserDetail/:user_id", authenticateToken, updateUserDetail);

/**
 * @swagger
 * /api/users/updateUserLogin/{user_id}:
 *   put:
 *     summary: Update user login details
 *     description: Allows an authenticated user to update their username, email, or email subscription preference.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Unique User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               is_subscribed_to_emails:
 *                 type: boolean
 *                 example: true
 *             example:
 *               username: "johndoe123"
 *               email: "johndoe@example.com"
 *               is_subscribed_to_emails: true
 *     responses:
 *       200:
 *         description: User login details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User login details updated successfully."
 *       400:
 *         description: Bad request - At least one field (username or email) is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Username or email is required."
 *       409:
 *         description: Conflict - Username or email already exists for another user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Username or email already exists."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No user found with the given ID."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.put("/updateUserLogin/:user_id", authenticateToken, updateUserLogin);

/**
 * @swagger
 * /api/users/deleteUser/{user_id}:
 *   delete:
 *     summary: Delete a user account
 *     description: Allows an authenticated user to delete their account from the system.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Unique User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "No user found with the given ID."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.delete("/deleteUser/:user_id", authenticateToken, deleteUser);

/**
 * @swagger
 * /api/users/userLoginDetails/{user_id}:
 *   get:
 *     summary: Get user login details
 *     description: Fetches the login details (email, username, and subscription status) of a user by their user ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Unique User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved user login details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     is_subscribed_to_emails:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No user found with the given ID."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.get(
  "/userLoginDetails/:user_id",
  authenticateToken,
  getUserLoginDetails
);

/**
 * @swagger
 * /api/users/updateUserPassword/{user_id}:
 *   put:
 *     summary: Update user password
 *     description: Allows a user to update their password after verifying the current password.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Unique User ID (UUID)
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePassword@2024"
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewSecurePassword@2024"
 *     responses:
 *       200:
 *         description: Password successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       400:
 *         description: Validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "New password and confirmation do not match."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An internal server error occurred."
 */
router.put("/updateUserPassword/:user_id", authenticateToken, updatePassword);

module.exports = router;
