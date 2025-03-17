const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");

// 🔹 Ruta de búsqueda de recetas
router.get("/search", recipesController.searchRecipe);

// 🔹 Ruta para obtener todas las recetas
router.get("/", recipesController.getAllRecipes);

// 🔹 Ruta para obtener detalles de una receta
router.get("/:id", recipesController.getRecipeById);

module.exports = router;
