const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/authenticateToken");
const {
  uploadToFirebase,
  downloadFromFirebase,
  deleteFromFirebase,
  getAllDocumentsForUser,
  convertDocument,
} = require("../../controllers");

/**
 * @swagger
 * /api/doc/uploadDocument:
 *   post:
 *     summary: Upload a document to Firebase
 *     description: Uploads a document to Firebase Storage and saves metadata in the database.
 *     tags:
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - file
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the document.
 *               description:
 *                 type: string
 *                 description: Description of the document.
 *               type:
 *                 type: string
 *                 description: Type of the document.
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *               user_id:
 *                 type: string
 *                 description: User ID of the document owner.
 *     responses:
 *       201:
 *         description: Document uploaded successfully.
 *       400:
 *         description: Missing required fields.
 *       403:
 *         description: User upload limit exceeded.
 *       500:
 *         description: Internal server error.
 */
router.post("/uploadDocument", authenticateToken, uploadToFirebase);

/**
 * @swagger
 * /api/doc/downloadDocument:
 *   get:
 *     summary: Download a document from Firebase
 *     description: Retrieves a document link from Firebase Storage based on document ID.
 *     tags:
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: document_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique ID of the document to download.
 *     responses:
 *       200:
 *         description: Document download link retrieved successfully.
 *       400:
 *         description: Missing document ID.
 *       404:
 *         description: Document not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/downloadDocument", authenticateToken, downloadFromFirebase);

/**
 * @swagger
 * /api/doc/deleteDocument:
 *   post:
 *     summary: Delete a document from Firebase
 *     description: Deletes a document from Firebase Storage and removes it from the database.
 *     tags:
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - document_id
 *               - user_id
 *             properties:
 *               document_id:
 *                 type: string
 *                 description: The unique ID of the document to delete.
 *               user_id:
 *                 type: string
 *                 description: The user ID of the document owner.
 *     responses:
 *       200:
 *         description: Document deleted successfully.
 *       400:
 *         description: Missing required fields.
 *       403:
 *         description: Unauthorized to delete this document.
 *       404:
 *         description: Document not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/deleteDocument", authenticateToken, deleteFromFirebase);

/**
 * @swagger
 * /api/doc/getAllDocuments:
 *   get:
 *     summary: Get all documents for a user
 *     description: Retrieves all documents uploaded by a specific user.
 *     tags:
 *       - Documents
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID whose documents are to be fetched.
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully.
 *       400:
 *         description: Missing user ID.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/getAllDocuments", authenticateToken, getAllDocumentsForUser);

router.get("/convertDocument", authenticateToken, convertDocument);

module.exports = router;
