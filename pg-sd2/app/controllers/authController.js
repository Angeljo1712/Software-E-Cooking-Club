const User = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OTP_EXPIRATION_MINUTES } = require("../config/constants");
const otpModel = require("../models/otpModel"); // Handles OTP storage and retrieval

// Generate a 6-digit OTP code for email verification
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send the OTP code to the user's email using configured SMTP (Outlook in this case)
async function sendOTPEmail(email, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Check SMTP connection before sending
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Error connecting to Outlook SMTP:", error);
    } else {
      console.log("✅ Outlook SMTP is ready to send emails!");
    }
  });

  // Send the OTP to the user's email address
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is: ${code}`,
  }).then(info => {
    console.log("✉️ OTP email sent:", info.response);
  }).catch(error => {
    console.error("❌ Failed to send OTP email:", error);
  });
}

// Show the form where user enters their email for registration
function showRegisterForm(req, res) {
  res.render("register", { title: "Register" });
}

/**
 * Handles the registration step that sends an OTP to the user's email:
 * - Checks if the email is already registered.
 * - If not, generates a new OTP and stores it in the database.
 * - Sends the OTP via email.
 * - Stores the email in the session for later verification.
 */
async function handleRegister(req, res) {
  const { email } = req.body;

  try {
    // Check if the email is already registered
    const user = await User.findUserByEmail(email);

    if (user) {
      return res.render("register", {
        title: "Register",
        error: "This email is already registered.",
      });
    }

    // Generate an OTP and set expiration
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000);

    // Save the OTP and send it via email
    await otpModel.storeOTP(email, otpCode, expiresAt);
    await sendOTPEmail(email, otpCode);

    // Temporarily store the email in session to verify later
    req.session.pendingEmail = email;

    res.redirect("/verify-code");
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  showRegisterForm,
  handleRegister,
};
