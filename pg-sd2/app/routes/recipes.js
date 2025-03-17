const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipesController");  // Import the recipes controller

// 🔹 Route to search for recipes
router.get("/search", recipesController.searchRecipe);

// 🔹 Route to retrieve all recipes
router.get("/", recipesController.getAllRecipes);

// 🔹 Route to retrieve details of a specific recipe by ID
router.get("/:id", recipesController.getRecipeById);

module.exports = router;  // Export the router to be used in the main application
