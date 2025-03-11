const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Route to get the list of users
router.get("/", async (req, res) => {
    try {
        const sql = "SELECT user_id, username, first_name, last_name, email, role FROM users";
        const users = await db.query(sql);
        res.render("users", { title: "User List", users });
    } catch (error) {
        console.error("❌ Error retrieving users:", error);
        res.status(500).send("Error loading the user list.");
    }
});

module.exports = router;
