const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Route to get the list of recipes
router.get("/", async (req, res) => {
    try {
        const sql = `
            SELECT recipes.recipe_id, recipes.title, recipes.description, recipes.ingredients, 
                   recipes.steps, categories.name AS category_name, recipes.image_url 
            FROM recipes
            LEFT JOIN categories ON recipes.category_id = categories.category_id
        `;
        const recipes = await db.query(sql);
        res.render("recipes", { title: "Recipe List", recipes });
    } catch (error) {
        console.error("❌ Error retrieving recipes:", error);
        res.status(500).send("Error loading the recipe list.");
    }
});

// Route to view the details of a specific recipe
router.get("/:id", async (req, res) => {
    try {
        const sql = `
            SELECT recipes.recipe_id, recipes.title, recipes.description, recipes.ingredients, 
                   recipes.steps, categories.name AS category_name, recipes.image_url 
            FROM recipes
            LEFT JOIN categories ON recipes.category_id = categories.category_id
            WHERE recipes.recipe_id = ?
        `;
        const recipe = await db.query(sql, [req.params.id]);

        if (recipe.length === 0) {
            return res.status(404).send("Recipe not found.");
        }

        res.render("recipe_details", { title: recipe[0].title, recipe: recipe[0] });
    } catch (error) {
        console.error("❌ Error retrieving recipe details:", error);
        res.status(500).send("Error loading the recipe details.");
    }
});

module.exports = router;
