const User = require("../models/userModel");

// 🔹 Mostrar detalles de un usuario
async function searchUsername(req, res) {
  try {
    const username = req.params.username;

    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const uploadedRecipes = await User.getRecipesByUserId(user.user_id);

    res.render("user_details", {
      title: `${user.username} - Profile`,
      user,
      uploadedRecipes,
    });
  } catch (error) {
    console.error("❌ Error retrieving user details:", error);
    res.status(500).send("Error loading user details.");
  }
}

// 🔹 Mostrar lista de todos los usuarios
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.render("users", { title: "User List", users });
  } catch (error) {
    console.error("❌ Error retrieving users:", error);
    res.status(500).send("Error loading the user list.");
  }
}

module.exports = {
  searchUsername,
  getAllUsers,
};
