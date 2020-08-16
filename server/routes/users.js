const express = require("express");
const router = express.Router();
const _ = require("lodash");
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

router.get("/friendRequest", async (req, res) => {
  const user = await User.findOne({ name: req.query.userName });
  res.status(200).json({ success: true, requests: user.requests });
});

// send a friend request
router.post("/friendRequest", async (req, res) => {
  await User.findOneAndUpdate(
    { name: req.body.friendName },
    { $push: { requests: req.body.userName } }
  );
  res.status(200).json({ success: true });
});

// remove a friend request
router.post("/friendRequest/decline", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { name: req.body.userName },
    { $pull: { requests: req.body.friendRequestName } },
    { new: true }
  );
  res.status(200).json({ success: true, requests: user.requests });
});

// accept a friend request and add friends to both users
router.post("/friendRequest/accept", async (req, res) => {
  const friend = await User.findOne({ name: req.body.friendRequestName });
  const user = await User.findOneAndUpdate(
    { name: req.body.userName },
    {
      $push: { friends: friend._id },
      $pull: { requests: req.body.friendRequestName },
    },
    { new: true }
  ).populate("friends");
  await User.findOneAndUpdate(
    { name: req.body.friendRequestName },
    { $push: { friends: user._id } }
  );
  const friendsList = _.map(
    user.friends,
    _.partialRight(_.pick, ["name", "imagePath"])
  );
  res
    .status(200)
    .json({ success: true, friendsList: friendsList, requests: user.requests });
});

module.exports = router;
