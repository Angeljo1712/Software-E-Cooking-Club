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

async function getCategories() {
    const sql = `SELECT category_id, name FROM categories`;
    return await db.query(sql);
}

async function insertRecipe({ user_id, title, description, ingredients, steps, category_id, image_url }) {
    const sql = `
        INSERT INTO recipes (user_id, title, description, ingredients, steps, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return await db.query(sql, [user_id, title, description, ingredients, steps, category_id, image_url]);
}

async function getRecipesWithImage(limit = 6) {
    const sql = `
      SELECT recipe_id, title, image_url
      FROM recipes
      WHERE image_url IS NOT NULL
      ORDER BY recipe_id DESC
      LIMIT ?
    `;
    return await db.query(sql, [limit]);
  }

  async function getRecipesByCategory(categoryId) {
    const sql = `
      SELECT r.recipe_id, r.title, r.description, r.image_url, c.name AS category_name
      FROM recipes r
      JOIN categories c ON r.category_id = c.category_id
      WHERE r.category_id = ?
    `;
    return await db.query(sql, [categoryId]);
  }
  
  async function getCategoryNameById(id) {
    const sql = `SELECT name FROM categories WHERE category_id = ?`;
    const rows = await db.query(sql, [id]);
    return rows.length ? rows[0].name : "Unknown";
  }
  

module.exports = {
    getAllRecipes,
    getRecipeById,
    searchRecipeByTerm,
    getCategories,
    insertRecipe,
    getRecipesWithImage,
    getRecipesByCategory,
    getCategoryNameById
};
