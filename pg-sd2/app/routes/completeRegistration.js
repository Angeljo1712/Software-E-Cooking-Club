const express = require("express");
const router = express.Router();
const completeController = require("../controllers/completeController");

router.get("/", completeController.showForm);
router.post("/", completeController.handleSubmit);

module.exports = router;
