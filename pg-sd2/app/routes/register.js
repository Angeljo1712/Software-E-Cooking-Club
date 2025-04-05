const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Mostrar formulario para ingresar el email
router.get("/", authController.showRegisterForm);

// Procesar email, verificar si existe y enviar OTP
router.post("/", authController.handleRegister);

module.exports = router;
