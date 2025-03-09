// Import express.js
const express = require("express");

// Create express app
var app = express();


// Usar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './app/views');


// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require("./services/db");

// Create a route for root - /
app.get("/", function (req, res) {
    res.send("✅ Servidor en ejecución.");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////
// Create a route for testing the db connection
app.get("/db_test", async function (req, res) {
    try {
        // Consultar la tabla users en lugar de una tabla ficticia test_table
        const sql = "SELECT * FROM users";
        const results = await db.query(sql);
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error("❌ Error en la conexión a la base de datos:", error);
        res.status(500).send("Error en la conexión a la base de datos.");
    }
});

// Ruta para mostrar la lista de usuarios
app.get("/users", async function (req, res) {
    try {
        const sql = "SELECT user_id, username, first_name, last_name, email, role FROM users";
        const users = await db.query(sql);
        res.render("users", { title: "User List", users });
    } catch (error) {
        console.error("❌ Error al recuperar usuarios:", error);
        res.status(500).send("Error al cargar la lista de usuarios.");
    }
});

// Ruta para mostrar la lista de recetas
app.get("/recipes", async function (req, res) {
    try {
        const sql = `
            SELECT recipes.recipe_id, recipes.title, recipes.description, recipes.ingredients, 
                   recipes.steps, categories.name AS category_name, recipes.image_url 
            FROM recipes
            LEFT JOIN categories ON recipes.category_id = categories.category_id
        `;
        const recipes = await db.query(sql);
        res.render("recipes", { title: "Recipe List", recipes });
    } catch (error) {
        console.error("❌ Error al recuperar recetas:", error);
        res.status(500).send("Error al cargar la lista de recetas.");
    }
});

// Ruta para ver los detalles de una receta específica
app.get("/recipe/:id", async function (req, res) {
    try {
        const sql = `
            SELECT recipes.recipe_id, recipes.title, recipes.description, recipes.ingredients, 
                   recipes.steps, categories.name AS category_name, recipes.image_url 
            FROM recipes
            LEFT JOIN categories ON recipes.category_id = categories.category_id
            WHERE recipes.recipe_id = ?
        `;
        const recipe = await db.query(sql, [req.params.id]);

        if (recipe.length === 0) {
            return res.status(404).send("Recipe not found.");
        }

        res.render("recipe_details", { title: recipe[0].title, recipe: recipe[0] });
    } catch (error) {
        console.error("❌ Error al recuperar detalles de la receta:", error);
        res.status(500).send("Error al cargar los detalles de la receta.");
    }
});













///////////////////////////////////////////////////////////////////////////////////////////


// Create a route for /goodbye
app.get("/goodbye", function (req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
app.get("/hello/:name", function (req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`✅ Servidor corriendo en http://127.0.0.1:${PORT}/`);
});
