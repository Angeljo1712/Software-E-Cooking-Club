const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Ruta para obtener la lista de usuarios
router.get("/", async (req, res) => {
    try {
        const sql = "SELECT user_id, username, first_name, last_name, email, role FROM users";
        const users = await db.query(sql);
        res.render("users", { title: "User List", users });
    } catch (error) {
        console.error("❌ Error al recuperar usuarios:", error);
        res.status(500).send("Error al cargar la lista de usuarios.");
    }
});

module.exports = router;
