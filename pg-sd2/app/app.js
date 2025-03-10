// Importar dependencias
const express = require("express");
const db = require("./services/db"); // Importar conexión a MySQL
const usersRoutes = require("./routes/users");
const recipesRoutes = require("./routes/recipes");

const app = express();

// Configurar Pug como motor de plantillas
app.set("view engine", "pug");
app.set("views", "./app/views");

// Middleware para archivos estáticos (CSS, imágenes, JS)
app.use(express.static("static"));

// Middleware para manejar datos enviados en formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (req, res) => {
    res.send("✅ Servidor en ejecución.");
});

// Ruta para probar conexión a la BD
app.get("/db_test", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM users");
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error("❌ Error en la conexión a la base de datos:", error);
        res.status(500).send("Error en la conexión a la base de datos.");
    }
});

// Importar rutas desde los módulos
app.use("/users", usersRoutes);
app.use("/recipes", recipesRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send("❌ Página no encontrada.");
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://127.0.0.1:${PORT}/`);
});
