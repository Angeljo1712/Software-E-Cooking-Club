const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router.get("/", loginController.showLoginForm); // ← opcional, solo si visitas /login por GET
router.post("/", loginController.handleLogin);  // ← ⚠️ obligatorio

module.exports = router;
