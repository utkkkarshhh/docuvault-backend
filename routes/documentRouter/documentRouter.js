const express = require("express");
const router = express.Router();
const documentController = require("../../controllers/documentController/documentController");
const authenticateToken = require("../../utils/authentication/authenticateToken");

router.post(
  "/uploadDocument",
  authenticateToken,
  documentController.uploadDocument
);

module.exports = router;
