const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("❌ Error destroying session:", err);
      return res.status(500).send("Logout failed");
    }
    res.redirect("/");
  });
});

module.exports = router;
