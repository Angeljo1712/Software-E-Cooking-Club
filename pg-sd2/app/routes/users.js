const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");  // Import the users controller


// 🔹 Route to retrieve a user by their username
router.get("/:username", usersController.searchUsername);

// 🔹 Route to retrieve the list of all users
router.get("/", usersController.getAllUsers);

module.exports = router;  // Export the router to be used in the main application
