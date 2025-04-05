const express = require("express");
const router = express.Router();
const verifyController = require("../controllers/verifyController");

router.get("/", verifyController.showVerifyPage);
router.post("/", verifyController.verifyCode);

module.exports = router;
