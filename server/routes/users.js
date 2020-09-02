const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const dbConnect = require("../utils/dbConnect");
const createToken = require("../utils/createToken");
const User = require("../../models/user");
const Notification = require("../../models/notification");

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
  // encrypt password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
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

// delete a friend
router.post("/friends/delete", async (req, res) => {
  const { friendName, userName } = req.body;
  const friend = await User.findOne({ name: friendName }).populate(
    "privateMessages"
  );
  const user = await User.findOne({ name: userName }).populate(
    "privateMessages"
  );

  const handleDeleteFriend = async (user, friendName, friendId) => {
    const privateMessages = user.privateMessages;
    const updateMessages = privateMessages.filter(
      (message) => message.friendName !== friendName
    );

    user.privateMessages = updateMessages;

    const friends = user.friends;
    const friendIndex = friends.indexOf(friendId);
    if (friendIndex > -1) {
      friends.splice(friendIndex, 1);
    }
    user.friends = friends;
    await user.save();
  };

  await handleDeleteFriend(user, friendName, friend._id);
  await handleDeleteFriend(friend, userName, user._id);

  res.status(200).json({ success: true });
});

router.get("/notifications", async (req, res) => {
  const { userName } = req.query;
  try {
    const user = await User.findOne({ name: userName }).populate(
      "notifications"
    );

    return res
      .status(200)
      .json({ success: true, notifications: user.notifications });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false });
  }
});

// add a notification to the user
router.post("/notifications", async (req, res) => {
  const { type, userName } = req.body;
  if (type === "delete friend") {
    const { friendName } = req.body;
    const newNotification = new Notification({
      type: type,
      friendName: friendName,
    });
    await newNotification.save();
    await User.findOneAndUpdate(
      { name: userName },
      { $push: { notifications: newNotification._id } }
    );
  } else if (type === "delete group") {
    const { adminName, groupName } = req.body;
    const newNotification = new Notification({
      type: type,
      adminName: adminName,
      groupName: groupName,
    });
    await newNotification.save();
    await User.findOneAndUpdate(
      { name: userName },
      { $push: { notifications: newNotification._id } }
    );
  } else if (type === "delete member") {
    const { groupName, userName } = req.body;
    const newNotification = new Notification({
      type: type,
      groupName: groupName,
    });
    await newNotification.save();
    await User.findOneAndUpdate(
      { name: userName },
      { $push: { notifications: newNotification._id } }
    );
  }
  return res.status(200).json({ success: true });
});

// remove all the notifications
router.post("/notifications/clear", async (req, res) => {
  const { userName } = req.body;
  try {
    await User.findOneAndUpdate(
      { name: userName },
      { $set: { notifications: [] } }
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ success: false });
  }
});

module.exports = router;
