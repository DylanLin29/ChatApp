const express = require("express");
const router = express.Router();
const dbConnect = require("../utils/dbConnect");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

dbConnect();

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  await newUser.save();

  const token = jwt.sign(
    { name: newUser.name, imagePath: newUser.imagePath, _id: newUser._id },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
  res.cookie("user-auth", token, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    maxAge: 3600000,
  });
  res.json({ success: true });
});

module.exports = router;
