const express = require("express");
const router = express.Router();  // ✅ Definir correctamente el router
const db = require("../services/db"); // Asegurar que se importe la conexión a la BD

// Ruta principal - Página de inicio
router.get("/", async (req, res) => {
    try {
        // Obtener la receta destacada
        const [featuredRecipe] = await db.query(`
            SELECT * FROM recipes ORDER BY RAND() LIMIT 1
        `) || [[]];

        const categories = await db.query("SELECT * FROM categories") || [];
        const recommendedRecipes = await db.query(`SELECT * FROM recipes ORDER BY RAND() LIMIT 2`) || [];
        const recentComments = await db.query(`
            SELECT c.comment_text, u.username 
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            ORDER BY c.created_at DESC LIMIT 2
        `) || [];
        const topUsers = await db.query(`
            SELECT u.username, COUNT(r.recipe_id) AS recipe_count 
            FROM users u 
            JOIN recipes r ON u.user_id = r.user_id
            GROUP BY u.username 
            ORDER BY recipe_count DESC LIMIT 2
        `) || [];

        console.log("📌 Categories being sent to Pug:", categories); // Debug

        res.render("home", {
            title: "Cooking Club - Home",
            featuredRecipe: featuredRecipe?.[0] || null,
            categories: Array.isArray(categories) ? categories : [],
            recommendedRecipes: Array.isArray(recommendedRecipes) ? recommendedRecipes : [],
            recentComments: Array.isArray(recentComments) ? recentComments : [],
            topUsers: Array.isArray(topUsers) ? topUsers : [],
            communityQuestions: Array.isArray(communityQuestions) ? communityQuestions : [],
            cookingVideos: Array.isArray(cookingVideos) ? cookingVideos : [],
            upcomingChallenges: Array.isArray(upcomingChallenges) ? upcomingChallenges : [] // ✅ Evita que sea undefined
        });
        
    } catch (error) {
        console.error("❌ Error loading homepage:", error);
        res.status(500).send("Error loading homepage.");
    }
});

module.exports = router; // ✅ Exportar correctamente el router
