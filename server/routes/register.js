const express = require("express");
const router = express.Router();
const dbConnect = require("../utils/dbConnect");
const createToken = require("../utils/createToken");
const User = require("../../models/user");

dbConnect();

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  await newUser.save();
  // Create Token and save as cookies
  createToken(res, newUser.name, newUser.imagePath, newUser._id);
  res.json({ success: true });
});

module.exports = router;
