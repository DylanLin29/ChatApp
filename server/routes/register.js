const express = require("express");
const router = express.Router();
const dbConnect = require("../utils/dbConnect");
const createToken = require("../utils/createToken");
const User = require("../../models/user");

dbConnect();

// check if the created username is unique
router.get("/", async (req, res) => {
  const newUser = await User.findOne({ name: req.query.name });
  if (newUser) {
    return res.status(409).json({ success: false });
  }
  res.status(200).json({ success: true });
});

router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  await newUser.save();
  // Create Token and save as cookies
  createToken(res, newUser.name, newUser.imagePath, newUser._id);
  res.json({ success: true });
});

module.exports = router;
