const express = require("express");
const router = express.Router();
const otpController = require("../../controllers/otpController/otpController");
const authenticateToken = require("../../utils/authentication/authenticateToken");

router.get("/sendOtp", authenticateToken, otpController.sendOtp);
router.post("/verifyOtp", authenticateToken, otpController.verifyOtp);

module.exports = router;
