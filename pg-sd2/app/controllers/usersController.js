const db = require("../services/db");  // Import the database service

// 🔹 Retrieve user details by username
async function searchUsername(req, res) {
    try {
        const username = req.params.username;  // Get the username from the request parameters

        // SQL query to get user details based on the username
        const userSql = `
            SELECT user_id, username, first_name, last_name, email, role 
            FROM users WHERE username = ?
        `;
        const users = await db.query(userSql, [username]);

        if (users.length === 0) {
            return res.status(404).send("User not found.");  // If no user is found, return a 404 error
        }

        const user = users[0];  // Extract the first user from the result

        // SQL query to get recipes uploaded by the user
        const uploadedRecipesSql = `
            SELECT recipe_id, title, image_url FROM recipes WHERE user_id = ?
        `;
        const uploadedRecipes = await db.query(uploadedRecipesSql, [user.user_id]);

        // Render the "user_details" page with user data and uploaded recipes
        res.render("user_details", {
            title: `${user.username} - Profile`,
            user,
            uploadedRecipes
        });

    } catch (error) {
        console.error("❌ Error retrieving user details:", error);
        res.status(500).send("Error loading user details.");  // Send a 500 response if an error occurs
    }
}

// 🔹 Retrieve all users
async function getAllUsers(req, res) {
    try {
        // SQL query to fetch all users with selected attributes
        const sql = "SELECT user_id, username, first_name, last_name, email, role FROM users";
        
        // Execute the query
        const users = await db.query(sql);

        // Render the "users" page and pass the retrieved user data
        res.render("users", { title: "User List", users });

    } catch (error) {
        console.error("❌ Error retrieving users:", error);  // Log any errors that occur
        res.status(500).send("Error loading the user list.");  // Return a 500 internal server error
    }
}

// 🔹 Export functions correctly
module.exports = {
    searchUsername,
    getAllUsers
};
