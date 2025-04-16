const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Show the complete registration form if the email has been verified
function showForm(req, res) {
  if (!req.session.verifiedEmail) {
    return res.redirect("/register"); // Redirect if email was not verified
  }

  res.render("complete_registration", {
    title: "Complete Registration",
    email: req.session.verifiedEmail
  });
}

/**
 * Handles the complete registration form submission:
 * - Retrieves and hashes the user's password.
 * - Inserts a new user into the database using the verified email.
 * - Clears the verified email from session to prevent reuse.
 * - Redirects the user to the login page on success.
 */
async function handleSubmit(req, res) {
  const { username, first_name, last_name, phone, password, country } = req.body;
  const email = req.session.verifiedEmail;

  try {
    // Encrypt the user's password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user with all required fields
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

    // Clear the verified email from the session
    req.session.verifiedEmail = null;

    // Redirect the user to the login page
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
