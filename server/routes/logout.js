const express = require("express");
const router = express.Router();

// Users logout
router.get("/", (req, res) => {
  res.clearCookie("user-auth");
  return res.status(200).redirect("http://localhost:3000");
});

module.exports = router;
