const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  const auth = req.cookies;
  console.log("x-auth", req.cookies["x-auth"]);
  try {
    const decoded = jwt.verify(req.cookies["x-auth"], "jwtkey");
    console.log(decoded);
    return res.json({ name: decoded.name });
  } catch (err) {
    console.log(err);
  }
  return res.json({ name: "dylan" });
});

module.exports = router;
