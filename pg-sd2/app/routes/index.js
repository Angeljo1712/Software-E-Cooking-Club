const express = require("express");
const router = express.Router();  // ✅ Define the router correctly
const db = require("../services/db"); // Ensure the database connection is imported


module.exports = router; // ✅ Correctly export the router
