const express = require("express");
const router = express.Router();
const documentController = require("../../controllers/documentController/documentControllerFirebase");
const authenticateToken = require("../../utils/authentication/authenticateToken");

router.post(
  "/uploadDocument",
  authenticateToken,
  documentController.uploadToFirebase
);

router.post(
  "/downloadDocument",
  authenticateToken,
  documentController.downloadFromFirebase
);
router.post(
  "/deleteDocument",
  authenticateToken,
  documentController.deleteFromFirebase
);

module.exports = router;
