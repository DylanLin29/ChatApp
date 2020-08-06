const express = require("express");
const router = express.Router();

// Users logout
router.get("/", (req, res) => {
  res.clearCookie("user-auth");
  return res.status(200).json({ success: true });
});

module.exports = router;
