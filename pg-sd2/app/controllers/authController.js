const User = require("../models/userModel");

// Mostrar la página de registro
function showRegisterForm(req, res) {
  res.render("register", { title: "Register" });
}

// Manejar envío del formulario
async function handleRegister(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findUserByEmail(email);

    if (user) {
      return res.render("register", {
        title: "Register",
        error: "This email is already registered.",
      });
    }

    await User.createUser(email);

    res.redirect("/login");
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  showRegisterForm,
  handleRegister,
};
