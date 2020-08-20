const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Message = require("../../models/message");
const PrivateMessage = require("../../models/privateMessage");
const GroupInfo = require("../../models/groupInfo");
const Group = require("../../models/group");
const dbConnect = require("../utils/dbConnect");
const User = require("../../models/user");
const message = require("../../models/message");

dbConnect();

// Return all the messages of a group chat
router.get("/", async (req, res) => {
  try {
    const groupInfo = await GroupInfo.findOne({ name: req.query.groupName });
    const group = await Group.findOne({ groupInfo: groupInfo._id }).populate(
      "messages"
    );
    res.status(200).json({ success: true, response: group.messages });
  } catch (err) {
    console.log(err);
  }
});

// save message of a group chat
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message({
      id: req.body.username,
      imagePath: req.body.imagePath,
      content: req.body.content,
    });
    const groupInfo = await GroupInfo.findOne({ name: req.body.groupName });
    await newMessage.save();
    await Group.findOneAndUpdate(
      { groupInfo: groupInfo._id },
      { $push: { messages: newMessage._id } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

// get all the messages of a private chat
router.get("/privateMessage", async (req, res) => {
  const { friendName, userName } = req.query;
  const user = await User.findOne({ name: userName }).populate(
    "privateMessages"
  );

  const friend = await User.findOne({ name: friendName }).populate(
    "privateMessages"
  );

  const userMessages = user.privateMessages.filter((message) => {
    return message.friendName === friendName;
  });

  const friendMessages = friend.privateMessages.filter((message) => {
    return message.friendName === userName;
  });

  const responses = _.sortBy(_.concat(userMessages, friendMessages), "time");

  res.status(200).json({ success: true, responses: responses });
});

// save the private messages into users
router.post("/privateMessage", async (req, res) => {
  const { content, friendName, userName } = req.body;
  const newPrivateMessage = new PrivateMessage({
    content: content,
    friendName: friendName,
    time: Date.now(),
  });
  await newPrivateMessage.save();
  await User.findOneAndUpdate(
    { name: userName },
    { $push: { privateMessages: newPrivateMessage._id } }
  );
  res.status(200).json({ success: true });
});

module.exports = router;
