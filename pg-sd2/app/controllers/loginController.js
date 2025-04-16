const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const { setUserSession } = require("../utils/sessionHelper");

/**
 * Renders the login form page.
 */
function showLoginForm(req, res) {
  res.render("login", { title: "Login" });
}

/**
 * Handles login form submission:
 * - Validates the request input.
 * - Looks up the user by email or username.
 * - Compares submitted password with stored hash.
 * - Sets the session on success or returns an error.
 */
async function handleLogin(req, res) {
  const { identifier, password } = req.body;

  // Validate input fields using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("login", {
      title: "Login",
      error: errors.array().map(err => err.msg).join("\n"),
      showError: true
    });
  }

  try {
    // Try to find user by email or username
    const user = await User.findByIdentifier(identifier);

    if (!user) {
      return res.render("login", {
        title: "Login",
        error: "User not found\nTry again",
        showError: true,
      });
    }

    // Validate the password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.render("login", {
        title: "Login",
        error: "Incorrect password\nTry again",
        showError: true,
      });
    }

    // Store user data in the session
    setUserSession(req, user);

    // Redirect to home on successful login
    res.redirect("/");
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  showLoginForm,
  handleLogin
};
