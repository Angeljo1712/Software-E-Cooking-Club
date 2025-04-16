const db = require("../services/db");

// 🔹 Find a user by email
async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return result[0]; // Return the first result or undefined
}

// 🔹 Store OTP temporarily in the database
async function storeOTP(email, code, expiresAt) {
  return await db.query(
    "INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)",
    [email, code, expiresAt]
  );
}

// 🔹 Create a new user with only email
async function createUser(email) {
  return await db.query("INSERT INTO users (email) VALUES (?)", [email]);
}

// 🔹 Get user details by username (used in profile page)
async function getUserByUsername(username) {
  const sql = `
    SELECT user_id, username, first_name, last_name, email, role, phone, country
    FROM users
    WHERE username = ?
  `;
  const result = await db.query(sql, [username]);
  return result[0];
}

// 🔹 Get all recipes uploaded by a user
async function getRecipesByUserId(userId) {
  const sql = `
    SELECT recipe_id, title, image_url
    FROM recipes
    WHERE user_id = ?
  `;
  return await db.query(sql, [userId]);
}

// 🔹 Get all users (for admin or listing purposes)
async function getAllUsers() {
  const sql = `
    SELECT user_id, username, first_name, last_name, email, role
    FROM users
  `;
  return await db.query(sql);
}

// 🔹 Create a full user record (after OTP verification)
async function createFullUser({ username, email, first_name, last_name, phone, password, country, role }) {
  return await db.query(
    "INSERT INTO users (username, email, first_name, last_name, phone, password, country, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [username, email, first_name, last_name, phone, password, country, role]
  );
}

// 🔹 Find user by email or username (used in login)
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
