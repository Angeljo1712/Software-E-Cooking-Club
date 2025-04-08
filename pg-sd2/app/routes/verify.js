const express = require("express");
const router = express.Router();
const verifyController = require("../controllers/verifyController");

// Show the OTP verification page (form input for code)
router.get("/", verifyController.showVerifyPage);

// Handle submitted OTP code and verify it
router.post("/", verifyController.verifyCode);

module.exports = router; // Export the router so it can be used in app.js
