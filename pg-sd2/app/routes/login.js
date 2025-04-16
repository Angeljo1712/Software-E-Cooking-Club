const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { body } = require("express-validator");

// Add validation middleware
router.post(
  "/",
  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Username or email is required."),
    body("password")
      .notEmpty()
      .withMessage("Password is required."),
  ],
  loginController.handleLogin
);

// Optional GET route for login page
router.get("/", loginController.showLoginForm);

module.exports = router;
