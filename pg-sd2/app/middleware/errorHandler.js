// Global error handling middleware function
function errorHandler(err, req, res, next) {
  console.error("🔥 Error:", err); // Log the error to the console
  res.status(500).render("error", {
    title: "Server Error",        // Title for the error page
    message: "Something went wrong!" // Message displayed to the user
  });
}

module.exports = errorHandler; // Export the middleware function
