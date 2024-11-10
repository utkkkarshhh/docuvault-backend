const express = require("express");
const router = express.Router();
const documentController = require("../../controllers/documentController/documentControllerFirebase");
const documentConversionController = require("../../controllers/documentController/documentConversionController")
const authenticateToken = require("../../utils/authentication/authenticateToken");

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         document_id:
 *           type: string
 *           format: uuid
 *         document_name:
 *           type: string
 *         document_description:
 *           type: string
 *         document_type:
 *           type: string
 *         document_link:
 *           type: string
 *         user_id:
 *           type: string
 *           format: uuid
 *
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *         limit:
 *           type: integer
 *
 *   responses:
 *     BadRequest:
 *       description: Bad request
 *     Forbidden:
 *       description: User has reached upload limit
 *     NotFound:
 *       description: Document or user not found
 *     Success:
 *       description: Successful response
 *     InternalServerError:
 *       description: Internal server error
 */

/**
 * @swagger
 * /api/doc/uploadDocument:
 *   post:
 *     summary: Upload a document to Firebase
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/uploadDocument",
  // authenticateToken,
  documentController.uploadToFirebase
);

// Download document as it is
/**
 * @swagger
 * /api/doc/downloadDocument:
 *   get:
 *     summary: Download a document from Firebase
 *     tags: [Documents]
 *     parameters:
 *       - in: body
 *         name: document_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document downloaded successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/downloadDocument",
  // authenticateToken,
  documentController.downloadFromFirebase
);

/**
 * @swagger
 * /api/doc/deleteDocument:
 *   post:
 *     summary: Delete a document from Firebase
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document_id:
 *                 type: string
 *                 format: uuid
 *               user_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post(
  "/deleteDocument",
  // authenticateToken,
  documentController.deleteFromFirebase
);

/**
 * @swagger
 * /api/doc/getAllDocuments:
 *   get:
 *     summary: Get all documents for a user
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully fetched documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get(
  "/getAllDocuments",
  // authenticateToken,
  documentController.getAllDocumentsForUser
);

router.get(
  "/convertDocument/",
   //authenticateToken, 
   documentConversionController.convertDocument)

module.exports = router;
