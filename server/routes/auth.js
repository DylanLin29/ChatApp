const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  console.log("user-auth", req.cookies["user-auth"]);
  try {
    const decoded = jwt.verify(req.cookies["user-auth"], process.env.JWT_KEY);
    return res
      .status(200)
      .json({ name: decoded.name, imagePath: decoded.imagePath });
  } catch (err) {
    console.log(err);
  }
  return res.json({ success: false });
});

module.exports = router;
