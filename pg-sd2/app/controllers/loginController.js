const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

function showLoginForm(req, res) {
  res.render("login", { title: "Login" });
}

async function handleLogin(req, res) {
  const { identifier, password } = req.body;

  try {
    const user = await User.findByIdentifier(identifier);

    if (!user) {
      return res.render("login", { error: "User not found", title: "Login" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.render("login", { error: "Incorrect password", title: "Login" });
    }

    req.session.user = {
      id: user.user_id,
      username: user.username,
      email: user.email
    };

    res.redirect("/"); // login exitoso
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  showLoginForm,
  handleLogin
};
