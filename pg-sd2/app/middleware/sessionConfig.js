// Import express-session middleware
const session = require("express-session");

// Configure session options
const sessionConfig = session({
  secret: process.env.SESSION_SECRET, // Secret key used to sign the session ID cookie
  resave: false,                      // Do not save session if unmodified
  saveUninitialized: true,            // Save new sessions even if they are not modified
  cookie: { maxAge: 600000 }          // Session cookie will expire after 10 minutes (in milliseconds)
});

// Export the configured session middleware
module.exports = sessionConfig;
