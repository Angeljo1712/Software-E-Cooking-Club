const express = require("express");
const router = express.Router(); // Create a new Express router instance

// Route to handle logout (GET /logout)
router.get("/", (req, res) => {
  req.session.destroy(err => { // Destroy the current session
    if (err) {
      console.error("❌ Error destroying session:", err);
      return res.status(500).send("Logout failed"); // Return error if session couldn't be destroyed
    }
    res.redirect("/"); // Redirect to homepage after logout
  });
});

module.exports = router; // Export the router to be used in app.js