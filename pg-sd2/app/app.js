// Import dependencies
const express = require("express");
const path = require("path");
const db = require("./services/db"); // Import MySQL connection
const session = require("express-session");



// Import routes from controllers
const app = express();
const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
const recipesRoutes = require("./routes/recipes");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const verifyRoutes = require("./routes/verify");
const completeRoutes = require("./routes/completeRegistration");
const logoutRoutes = require("./routes/logout");



// Configure Pug as the template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = app.get("views"); // 🔥 Set the base directory for Pug
app.use(express.static(path.join(__dirname, "..", "static")));




app.use(session({
  secret: "s3cret_c0de_OTP", // Puedes cambiarlo por cualquier valor seguro
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // 10 minutos de sesión
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Main route
app.get("/", (req, res) => {
    const user = req.session.user; // Esto puede ser undefined si no está logueado
    res.render("index", {
      title: "Home - Cooking Club",
      user
    });
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
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/verify-code", verifyRoutes);
app.use("/complete-registration", completeRoutes);
app.use("/logout", logoutRoutes);




// Middleware to handle not found routes
app.use((req, res) => {
    res.status(404).send("❌ Page not found.");
});




// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}/`);
});
