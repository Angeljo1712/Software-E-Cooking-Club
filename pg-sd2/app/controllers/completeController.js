const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

function showForm(req, res) {
  if (!req.session.verifiedEmail) {
    return res.redirect("/register");
  }

  res.render("complete_registration", {
    title: "Complete Registration",
    email: req.session.verifiedEmail
  });
}

async function handleSubmit(req, res) {
  const { username, first_name, last_name, phone, password, country } = req.body;
  const email = req.session.verifiedEmail;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.createFullUser({
      username,
      email,
      first_name,
      last_name,
      phone,
      password: hashedPassword,
      country,
      role: "user",
    });

    req.session.verifiedEmail = null;
    res.redirect("/login");
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).send("Registration failed.");
  }
}

module.exports = {
  showForm,
  handleSubmit,
};
