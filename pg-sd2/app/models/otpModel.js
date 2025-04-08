const db = require("../services/db");

// Save a new OTP
async function storeOTP(email, code, expiresAt) {
  return await db.query(
    "INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)",
    [email, code, expiresAt]
  );
}

// Get a valid OTP by email and code
async function getValidOTP(email, code) {
  const result = await db.query(
    "SELECT * FROM otp_codes WHERE email = ? AND code = ? AND expires_at > NOW()",
    [email, code]
  );
  return result[0]; // Return single result
}

// Delete OTPs by email
async function deleteOTP(email) {
  return await db.query("DELETE FROM otp_codes WHERE email = ?", [email]);
}

module.exports = {
  storeOTP,
  getValidOTP,
  deleteOTP
};
