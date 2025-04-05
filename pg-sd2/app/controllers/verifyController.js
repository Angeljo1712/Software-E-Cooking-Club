const db = require("../services/db");

function showVerifyPage(req, res) {
  res.render("verify_code", { title: "Verify Code", email: req.session.pendingEmail });
}

async function verifyCode(req, res) {
  const { code } = req.body;
  const email = req.session.pendingEmail;

  try {
    const result = await db.query(
      "SELECT * FROM otp_codes WHERE email = ? AND code = ? AND expires_at > NOW()",
      [email, code]
    );

    if (result.length === 0) {
      return res.render("verify_code", {
        title: "Verify Code",
        error: "Invalid or expired code",
        email
      });
    }

    // OTP válido, ir al paso final: registrar datos personales
    req.session.verifiedEmail = email;
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
