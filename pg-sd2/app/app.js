// Import dependencies
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const app = express();
const path = require("path");
const db = require("./services/db"); // Import MySQL connection
const sessionConfig = require("./middleware/sessionConfig"); // Import session configuration
const morgan = require("morgan"); // HTTP request logger

// Import route modules
const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const recipesRoutes = require("./routes/recipes");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const verifyRoutes = require("./routes/verify");
const completeRoutes = require("./routes/completeRegistration");
const logoutRoutes = require("./routes/logout");

// Apply session configuration middleware
app.use(sessionConfig);

// Configure view engine and static files
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views"); // Set the base directory for Pug includes
app.use(express.static(path.join(__dirname, "..", "static")));

// Middleware for logging and parsing requests
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main homepage route
app.get("/", (req, res) => {
    const user = req.session.user; // Can be undefined if the user is not logged in
    res.render("index", {
      title: "Home - Cooking Club",
      user
    });
});

// Route modules
app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/recipes", recipesRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/verify-code", verifyRoutes);
app.use("/complete-registration", completeRoutes);
app.use("/logout", logoutRoutes);

// Route for testing the database connection
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

// Fallback middleware for handling 404 errors
app.use((req, res) => {
    res.status(404).send("❌ Page not found.");
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}/`);
});
