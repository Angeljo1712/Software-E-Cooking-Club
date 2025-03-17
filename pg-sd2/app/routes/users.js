const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// 🔹 Ruta para obtener un usuario por su nombre de usuario
router.get("/:username", usersController.searchUsername);

// 🔹 Ruta para obtener la lista de todos los usuarios
router.get("/", usersController.getAllUsers);

module.exports = router;
