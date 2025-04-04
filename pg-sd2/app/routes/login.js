const express = require("express");
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get("/", (req, res) => {
  res.render("login", { title: "Login" });
});

module.exports = router; 