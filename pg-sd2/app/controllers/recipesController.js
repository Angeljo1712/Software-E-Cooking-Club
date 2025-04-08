const multer = require("multer");
const path = require("path");
const Recipe = require("../models/recipeModel");

// Configure storage settings for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/uploads"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Display all recipes
async function getAllRecipes(req, res) {
  try {
    const recipes = await Recipe.getAllRecipes();
    res.render("recipes", { title: "Recipe List", recipes });
  } catch (error) {
    console.error("❌ Error loading recipes:", error);
    res.status(500).send("Server error");
  }
}

// Display a specific recipe by ID
async function getRecipeById(req, res) {
  try {
    const recipe = await Recipe.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).send("Recipe not found");

    res.render("recipe_details", {
      title: recipe.title,
      recipe,
      user: req.session.user // Include user context for header display
    });
  } catch (error) {
    console.error("❌ Error retrieving recipe:", error);
    res.status(500).send("Server error");
  }
}

// Handle search form input and redirect to matching recipe
async function searchRecipe(req, res) {
  try {
    const term = req.query.query;
    if (!term) return res.redirect("/recipes");

    const recipe = await Recipe.searchRecipeByTerm(term);
    if (!recipe) return res.status(404).send("Recipe not found");

    res.redirect(`/recipes/${recipe.recipe_id}`);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).send("Server error");
  }
}

// Show the form for creating a new recipe
async function showCreateForm(req, res) {
  try {
    const categories = await Recipe.getCategories();
    res.render("recipe_form", { title: "New Recipe", categories });
  } catch (error) {
    console.error("❌ Error showing recipe form:", error);
    res.status(500).send("Error showing form");
  }
}

// Handle form submission and insert recipe into database
async function createRecipe(req, res) {
  const { title, description, ingredients, steps, category_id } = req.body;
  const userId = req.session.user?.id;

  if (!userId) return res.status(403).send("Unauthorized");

  if (!req.file) return res.status(400).send("Image is required.");

  const image_url = "/uploads/" + req.file.filename;

  try {
    await Recipe.insertRecipe({
      user_id: userId,
      title,
      description,
      ingredients,
      steps,
      category_id,
      image_url
    });
    res.redirect("/recipes");
  } catch (error) {
    console.error("❌ Error creating recipe:", error);
    res.status(500).send("Error saving recipe");
  }
}

// Display recipes filtered by category
async function getByCategory(req, res) {
  const categoryId = req.params.id;
  try {
    const recipes = await Recipe.getRecipesByCategory(categoryId);
    const categoryName = await Recipe.getCategoryNameById(categoryId);

    res.render("recipesByCategory", {
      title: `Recipes - ${categoryName}`,
      recipes,
      categoryName,
      user: req.session.user
    });
  } catch (error) {
    console.error("❌ Error fetching recipes by category:", error);
    res.status(500).send("Error fetching recipes by category");
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  searchRecipe,
  showCreateForm,
  createRecipe,
  getByCategory,
  uploadMiddleware: upload.single("image") // Middleware to handle single file upload from field named "image"
};
