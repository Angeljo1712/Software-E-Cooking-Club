// Import dependencies
const express = require("express");
const path = require("path");
const db = require("./services/db"); // Import MySQL connection

// Import routes from controllers
const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const recipesRoutes = require("./routes/recipes");

const app = express();

// Configure Pug as the template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views"); // 🔥 Set the base directory for Pug

// Middleware for serving static files (CSS, images, JS)
app.use(express.static("static")); // Ensure correct static folder path

// Middleware to handle data submitted via forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main route
app.get("/", (req, res) => {
    res.render("index", { title: "Home - Cooking Club" });
});

// Route to test database connection
app.get("/db_test", async (req, res) => {
    try {
        const categories = await db.query("SELECT * FROM categories");
        console.log("📌 Categories data:", categories);
        res.json(categories);
    } catch (error) {
        console.error("❌ Database connection error:", error);
        res.status(500).send("Database connection error.");
    }
});

// Import routes from modules
app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/recipes", recipesRoutes);
app.use("/static", express.static("static"));



// Middleware to handle not found routes
app.use((req, res) => {
    res.status(404).send("❌ Page not found.");
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}/`);
});
