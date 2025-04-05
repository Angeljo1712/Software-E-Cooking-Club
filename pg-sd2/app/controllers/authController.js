const User = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// 🔹 Genera un OTP de 6 dígitos
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔹 Envia el OTP por correo electrónico usando Outlook
async function sendOTPEmail(email, code) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  

  // (Opcional) Verifica conexión con el servidor SMTP de Outlook
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Error connecting to Outlook SMTP:", error);
    } else {
      console.log("✅ Outlook SMTP is ready to send emails!");
    }
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is: ${code}`,
  });
}

// 🔹 Muestra el formulario para ingresar el email
function showRegisterForm(req, res) {
  res.render("register", { title: "Register" });
}

// 🔹 Maneja el envío del email en el registro con OTP
async function handleRegister(req, res) {
  const { email } = req.body;

  try {
    // Verifica si el email ya está registrado
    const user = await User.findUserByEmail(email);

    if (user) {
      return res.render("register", {
        title: "Register",
        error: "This email is already registered.",
      });
    }

    // Genera y guarda el código OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // Expira en 10 minutos

    await User.storeOTP(email, otp, expiresAt);
    await sendOTPEmail(email, otp);

    // Guarda el email temporalmente en la sesión para usarlo en la verificación
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
