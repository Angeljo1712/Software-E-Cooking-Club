const db = require("../services/db");

// 🔹 Obtener detalles del usuario por nombre de usuario
async function searchUsername(req, res) {
    try {
        const username = req.params.username;

        // Consulta SQL para obtener datos del usuario
        const userSql = `
            SELECT user_id, username, first_name, last_name, email, role 
            FROM users WHERE username = ?
        `;
        const users = await db.query(userSql, [username]);

        if (users.length === 0) {
            return res.status(404).send("User not found.");
        }

        const user = users[0];

        // Consulta SQL para obtener recetas subidas por el usuario
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
}

// 🔹 Obtener todos los usuarios
async function getAllUsers(req, res) {
    try {
        const sql = "SELECT user_id, username, first_name, last_name, email, role FROM users";
        const users = await db.query(sql);

        res.render("users", { title: "User List", users });

    } catch (error) {
        console.error("❌ Error retrieving users:", error);
        res.status(500).send("Error loading the user list.");
    }
}

// 🔹 Exportar funciones correctamente
module.exports = {
    searchUsername,
    getAllUsers
};
