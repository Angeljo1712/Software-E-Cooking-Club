const otpModel = require("../models/otpModel"); // Import the OTP model

// Renders the OTP verification form with the user's pending email
function showVerifyPage(req, res) {
  res.render("verify_code", {
    title: "Verify Code",
    email: req.session.pendingEmail
  });
}

/**
 * Handles OTP code submission:
 * - Validates input from the user.
 * - Checks if the code is valid and not expired using the OTP model.
 * - Deletes the OTP after successful validation.
 * - Stores the verified email in the session.
 * - Redirects to the complete registration step.
 */
async function verifyCode(req, res) {
  const { code } = req.body;
  const email = req.session.pendingEmail;

  // Ensure both email and code are provided
  if (!email || !code) {
    return res.render("verify_code", {
      title: "Verify Code",
      error: "Email or code is missing.",
      email,
    });
  }

  try {
    // Attempt to retrieve a valid OTP entry
    const otp = await otpModel.getValidOTP(email, code);

    // If no valid OTP found, return an error message
    if (!otp) {
      return res.render("verify_code", {
        title: "Verify Code",
        error: "Invalid or expired code",
        email
      });
    }

    // Clean up OTP record after successful validation
    await otpModel.deleteOTP(email);

    // Store the verified email in the session
    req.session.verifiedEmail = email;

    // Redirect to complete registration step
    res.redirect("/complete-registration");
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  showVerifyPage,
  verifyCode
};
