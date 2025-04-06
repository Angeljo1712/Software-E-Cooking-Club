const db = require("../services/db");

// 🔹 Buscar un usuario por su email
async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return result[0]; // Devuelve el primer resultado o undefined
}

// Guardar OTP temporalmente
async function storeOTP(email, code, expiresAt) {
  return await db.query(
    "INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)",
    [email, code, expiresAt]
  );
}



// 🔹 Crear un nuevo usuario solo con email
async function createUser(email) {
  return await db.query("INSERT INTO users (email) VALUES (?)", [email]);
}

// 🔹 Buscar usuario por username (para el perfil)
async function getUserByUsername(username) {
  const sql = `
    SELECT user_id, username, first_name, last_name, email, role, phone, country
    FROM users
    WHERE username = ?
  `;
  const result = await db.query(sql, [username]);
  return result[0];
}

// 🔹 Obtener recetas subidas por un usuario
async function getRecipesByUserId(userId) {
  const sql = `
    SELECT recipe_id, title, image_url
    FROM recipes
    WHERE user_id = ?
  `;
  return await db.query(sql, [userId]);
}

// 🔹 Obtener todos los usuarios (para listado general)
async function getAllUsers() {
  const sql = `
    SELECT user_id, username, first_name, last_name, email, role
    FROM users
  `;
  return await db.query(sql);
}

async function createFullUser({ username, email, first_name, last_name, phone, password, country, role }) {
  return await db.query(
    "INSERT INTO users (username, email, first_name, last_name, phone, password, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [username, email, first_name, last_name, phone, password, country, role]
  );
}

async function findByIdentifier(identifier) {
  const users = await db.query(
    "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
    [identifier, identifier]
  );
  return users[0];
}



module.exports = {
  findUserByEmail,
  createUser,
  getUserByUsername,
  getRecipesByUserId,
  getAllUsers,
  storeOTP,
  createFullUser,
  findByIdentifier
};
