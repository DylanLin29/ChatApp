const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const GroupInfo = require("../../models/groupInfo");
const Group = require("../../models/group");
const dbConnect = require("../utils/dbConnect");

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

module.exports = router;
