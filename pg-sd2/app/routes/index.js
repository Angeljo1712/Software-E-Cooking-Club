const express = require("express");
const router = express.Router();  // ✅ Define the router correctly
const db = require("../services/db"); // Ensure the database connection is imported

// Main route - Homepage
router.get("/", async (req, res) => {
    try {
        // Retrieve a random featured recipe
        const [featuredRecipe] = await db.query(`
            SELECT * FROM recipes ORDER BY RAND() LIMIT 1
        `) || [[]];

        // Fetch all recipe categories
        const categories = await db.query("SELECT * FROM categories") || [];

        // Retrieve two randomly selected recommended recipes
        const recommendedRecipes = await db.query(`
            SELECT * FROM recipes ORDER BY RAND() LIMIT 2
        `) || [];

        // Fetch the two most recent comments along with the username of the commenter
        const recentComments = await db.query(`
            SELECT c.comment_text, u.username 
            FROM comments c
            JOIN users u ON c.user_id = u.user_id
            ORDER BY c.created_at DESC LIMIT 2
        `) || [];

        // Retrieve the top 2 users who have posted the most recipes
        const topUsers = await db.query(`
            SELECT u.username, COUNT(r.recipe_id) AS recipe_count 
            FROM users u 
            JOIN recipes r ON u.user_id = r.user_id
            GROUP BY u.username 
            ORDER BY recipe_count DESC LIMIT 2
        `) || [];

        console.log("📌 Categories being sent to Pug:", categories); // Debugging log

        // Render the homepage with retrieved data
        res.render("index", {
            title: "Cooking Club - Home",
            featuredRecipe: featuredRecipe?.[0] || null, // Ensure featuredRecipe is not undefined
            categories: Array.isArray(categories) ? categories : [], // Ensure categories is an array
            recommendedRecipes: Array.isArray(recommendedRecipes) ? recommendedRecipes : [], // Ensure recommendedRecipes is an array
            recentComments: Array.isArray(recentComments) ? recentComments : [], // Ensure recentComments is an array
            topUsers: Array.isArray(topUsers) ? topUsers : [], // Ensure topUsers is an array
            communityQuestions: Array.isArray(communityQuestions) ? communityQuestions : [], // Prevent undefined errors
            cookingVideos: Array.isArray(cookingVideos) ? cookingVideos : [], // Prevent undefined errors
            upcomingChallenges: Array.isArray(upcomingChallenges) ? upcomingChallenges : [] // ✅ Avoid undefined errors
        });
        
    } catch (error) {
        console.error("❌ Error loading homepage:", error); // Log errors in case of failure
        res.status(500).send("Error loading homepage."); // Return a 500 internal server error
    }
});

module.exports = router; // ✅ Correctly export the router
