// Import required modules
const express = require("express");
const router = express.Router(); // Create a new router instance

const completeController = require("../controllers/completeController"); // Import the controller for complete registration

// Route to display the registration completion form
router.get("/", completeController.showForm);

// Route to handle the form submission
router.post("/", completeController.handleSubmit);

// Export the router to be used in the main app
module.exports = router;
