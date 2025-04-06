const multer = require("multer");
const path = require("path");
const Recipe = require("../models/recipeModel");


// Configurar almacenamiento para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "static/uploads"); // asegúrate de que esta carpeta exista
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({ storage });


async function getAllRecipes(req, res) {
    try {
        const recipes = await Recipe.getAllRecipes();
        res.render("recipes", { title: "Recipe List", recipes });
    } catch (error) {
        console.error("❌ Error loading recipes:", error);
        res.status(500).send("Server error");
    }
}

async function getRecipeById(req, res) {
    try {
        const recipe = await Recipe.getRecipeById(req.params.id);
        if (!recipe) return res.status(404).send("Recipe not found");

        res.render("recipe_details", {
            title: recipe.title,
            recipe,
            user: req.session.user // ⬅️ AÑADE ESTA LÍNEA
        });
    } catch (error) {
        console.error("❌ Error retrieving recipe:", error);
        res.status(500).send("Server error");
    }
}

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


// Mostrar formulario
async function showCreateForm(req, res) {
    try {
        const categories = await Recipe.getCategories();
        res.render("recipe_form", { title: "New Recipe", categories });
    } catch (error) {
        console.error("❌ Error showing recipe form:", error);
        res.status(500).send("Error showing form");
    }
}

// Guardar receta
async function createRecipe(req, res) {
    const { title, description, ingredients, steps, category_id } = req.body;
    const userId = req.session.user?.id;
  
    if (!userId) return res.status(403).send("Unauthorized");
  
    // Verifica que se haya subido una imagen
    if (!req.file) return res.status(400).send("Image is required.");
  
    const image_url = "/uploads/" + req.file.filename; // Guardar la ruta relativa
  
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
  


  module.exports = {
    getAllRecipes,
    getRecipeById,
    searchRecipe,
    showCreateForm,
    createRecipe,
    uploadMiddleware: upload.single("image") // ✅ Ahora sí, con coma antes
  };
