const express = require("express");
const router = express.Router();
const db = require("../services/db");


// 🔹 Search route - MUST BE BEFORE "/:id"
router.get("/search", async (req, res) => {
    try {
        const query = req.query.query; // Get the search term

        if (!query) {
            return res.redirect("/recipes"); // Redirect to recipes if search is empty
        }

        const sql = `
            SELECT recipes.recipe_id FROM recipes
            WHERE recipes.title LIKE ? 
               OR recipes.description LIKE ? 
               OR recipes.ingredients LIKE ?
            LIMIT 1
        `;

        // Search for one matching recipe
        const [recipe] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`]);

        if (!recipe) {
            return res.status(404).send("No matching recipe found."); // Handle no matches
        }

        // Redirect to the details page of the first matched recipe
        res.redirect(`/recipes/${recipe.recipe_id}`);

    } catch (error) {
        console.error("❌ Error searching for recipe:", error);
        res.status(500).send("Error processing search request.");
    }
});


// 🔹 Route to retrieve all recipes
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

// 🔹 Route to view recipe details
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
