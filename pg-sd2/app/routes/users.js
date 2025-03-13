const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Route to get user details by username
router.get("/:username", async (req, res) => {
    try {
        const username = req.params.username;

        // Fetch user details using username
        const userSql = `
            SELECT user_id, username, first_name, last_name, email, role 
            FROM users WHERE username = ?
        `;
        const [user] = await db.query(userSql, [username]);

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Fetch recipes uploaded by the user
        const uploadedRecipesSql = `
            SELECT recipe_id, title, image_url FROM recipes WHERE user_id = ?
        `;
        const uploadedRecipes = await db.query(uploadedRecipesSql, [user.user_id]);

        res.render("user_details", {
            title: `${user.username} - Profile`,
            user,
            uploadedRecipes
        });

    } catch (error) {
        console.error("❌ Error retrieving user details:", error);
        res.status(500).send("Error loading user details.");
    }
});

// Route to retrieve the list of users
router.get("/", async (req, res) => {
    try {
        // SQL query to fetch all users with selected attributes
        const sql = "SELECT user_id, username, first_name, last_name, email, role FROM users";
        
        // Execute the query
        const users = await db.query(sql);

        // Render the 'users' page and pass the retrieved user data
        res.render("users", { title: "User List", users });

    } catch (error) {
        console.error("❌ Error retrieving users:", error); // Log any errors that occur
        res.status(500).send("Error loading the user list."); // Return a 500 internal server error
    }
});

module.exports = router; // ✅ Correctly export the router
