const db = require('../services/db');  // Import the database service

// 🔹 Search for a recipe by a search term
async function searchRecipe(req, res) {
    try {
        const query = req.query.query; // Get the search term from the request

        if (!query) return res.redirect("/recipes"); // If no term is provided, redirect to the recipe list

        const sql = `
            SELECT recipe_id FROM recipes
            WHERE title LIKE ? OR description LIKE ? OR ingredients LIKE ?
            LIMIT 1
        `;

        // Execute the SQL query with the search term in the title, description, or ingredients
        const [recipe] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`]);

        if (!recipe) return res.status(404).send("No matching recipe found."); // If no match is found, return a 404 error

        res.redirect(`/recipes/${recipe.recipe_id}`); // Redirect to the first matched recipe

    } catch (error) {
        console.error("❌ Error searching for recipe:", error);
        res.status(500).send("Error processing search request."); // Send a 500 response if an error occurs
    }
}

// 🔹 Retrieve all recipes
async function getAllRecipes(req, res) {
    try {
        const sql = `
            SELECT r.recipe_id, r.title, r.description, r.ingredients, r.steps, 
                   c.name AS category_name, r.image_url
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.category_id
        `;
        
        // Execute the query to get all recipes along with their category names
        const recipes = await db.query(sql);
        
        // Render the "recipes" page with the retrieved recipes
        res.render("recipes", { title: "Recipe List", recipes });

    } catch (error) {
        console.error("❌ Error retrieving recipes:", error);
        res.status(500).send("Error loading the recipe list."); // Send a 500 response if an error occurs
    }
}

// 🔹 Retrieve recipe details by ID
async function getRecipeById(req, res) {
    try {
        const sql = `
            SELECT r.recipe_id, r.title, r.description, r.ingredients, r.steps, 
                   c.name AS category_name, r.image_url
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.category_id
            WHERE r.recipe_id = ?
        `;

        // Execute the query with the provided recipe ID
        const recipe = await db.query(sql, [req.params.id]);

        if (recipe.length === 0) return res.status(404).send("Recipe not found."); // If no recipe is found, return a 404 error

        // Render the "recipe_details" page with the retrieved recipe data
        res.render("recipe_details", { title: recipe[0].title, recipe: recipe[0] });

    } catch (error) {
        console.error("❌ Error retrieving recipe details:", error);
        res.status(500).send("Error loading the recipe details."); // Send a 500 response if an error occurs
    }
}

// Export the functions to be used in routes
module.exports = {
    searchRecipe,
    getAllRecipes,
    getRecipeById,
};
