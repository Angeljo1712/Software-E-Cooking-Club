const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Show form to enter email address
router.get("/", authController.showRegisterForm);

// Handle form submission: check if email exists and send OTP
router.post("/", authController.handleRegister);

module.exports = router; // Export the router to be used in app.js
