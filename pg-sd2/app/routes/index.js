// Import required modules
const express = require("express");
const router = express.Router(); // Create a new router instance

const db = require("../services/db"); // Import database service

// Export the router so it can be used in the main application
module.exports = router;