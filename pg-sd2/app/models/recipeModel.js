const db = require("../services/db");

async function getAllRecipes() {
    const sql = `
        SELECT r.recipe_id, r.title, r.description, r.ingredients, r.steps, 
               c.name AS category_name, r.image_url
        FROM recipes r
        LEFT JOIN categories c ON r.category_id = c.category_id
    `;
    return await db.query(sql);
}

async function getRecipeById(id) {
    const sql = `
        SELECT r.recipe_id, r.title, r.description, r.ingredients, r.steps, 
               c.name AS category_name, r.image_url
        FROM recipes r
        LEFT JOIN categories c ON r.category_id = c.category_id
        WHERE r.recipe_id = ?
    `;
    const rows = await db.query(sql, [id]);
    return rows[0];
}

async function searchRecipeByTerm(term) {
    const sql = `
        SELECT recipe_id FROM recipes
        WHERE title LIKE ? OR description LIKE ? OR ingredients LIKE ?
        LIMIT 1
    `;
    const rows = await db.query(sql, [`%${term}%`, `%${term}%`, `%${term}%`]);
    return rows[0];
}

module.exports = {
    getAllRecipes,
    getRecipeById,
    searchRecipeByTerm,
};
