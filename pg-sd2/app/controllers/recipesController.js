const Recipe = require("../models/recipeModel");

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
        res.render("recipe_details", { title: recipe.title, recipe });
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

module.exports = {
    getAllRecipes,
    getRecipeById,
    searchRecipe,
};
