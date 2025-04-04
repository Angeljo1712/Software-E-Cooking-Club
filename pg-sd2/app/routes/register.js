const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.showRegisterForm);
router.post("/", authController.handleRegister);

module.exports = router;
