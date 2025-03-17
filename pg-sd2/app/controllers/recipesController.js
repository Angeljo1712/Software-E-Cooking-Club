const db = require('../services/db');

// 🔹 Buscar una receta por término de búsqueda
async function searchRecipe(req, res) {
    try {
        const query = req.query.query; // Obtener el término de búsqueda

        if (!query) return res.redirect("/recipes"); // Si no hay término, redirigir

        const sql = `
            SELECT recipe_id FROM recipes
            WHERE title LIKE ? OR description LIKE ? OR ingredients LIKE ?
            LIMIT 1
        `;

        const [recipe] = await db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`]);

        if (!recipe) return res.status(404).send("No matching recipe found.");

        res.redirect(`/recipes/${recipe.recipe_id}`); // Redirigir a la receta encontrada

    } catch (error) {
        console.error("❌ Error searching for recipe:", error);
        res.status(500).send("Error processing search request.");
    }
}

// 🔹 Obtener todas las recetas
async function getAllRecipes(req, res) {
    try {
        const sql = `
            SELECT r.recipe_id, r.title, r.description, r.ingredients, r.steps, 
                   c.name AS category_name, r.image_url
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.category_id
        `;
        const recipes = await db.query(sql);
        res.render("recipes", { title: "Recipe List", recipes });

    } catch (error) {
        console.error("❌ Error retrieving recipes:", error);
        res.status(500).send("Error loading the recipe list.");
    }
}

// 🔹 Obtener detalles de una receta por ID
async function getRecipeById(req, res) {
    try {
        const sql = `
            SELECT r.recipe_id, r.title, r.description, r.ingredients, r.steps, 
                   c.name AS category_name, r.image_url
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.category_id
            WHERE r.recipe_id = ?
        `;
        const recipe = await db.query(sql, [req.params.id]);

        if (recipe.length === 0) return res.status(404).send("Recipe not found.");

        res.render("recipe_details", { title: recipe[0].title, recipe: recipe[0] });

    } catch (error) {
        console.error("❌ Error retrieving recipe details:", error);
        res.status(500).send("Error loading the recipe details.");
    }
}






// Exportar las funciones para ser usadas en las rutas
module.exports = {
    searchRecipe,
    getAllRecipes,
    getRecipeById,
};