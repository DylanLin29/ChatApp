const express = require("express");
const router = express.Router();
const dbConnect = require("../utils/dbConnect");
const createToken = require("../utils/createToken");
const User = require("../../models/user");

dbConnect();

// search user in the database
router.get("/", async (req, res) => {
  const newUser = await User.findOne({ name: req.query.name });
  if (newUser) {
    return res.status(200).json({
      success: false,
      user: {
        name: newUser.name,
        imagePath: newUser.imagePath,
      },
    });
  }
  res.status(200).json({ success: true });
});

// create a user
router.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  await newUser.save();
  // Create Token and save as cookies
  createToken(res, newUser.name, newUser.imagePath, newUser._id);
  res.json({ success: true });
});

module.exports = router;
