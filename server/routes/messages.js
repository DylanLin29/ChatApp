const express = require("express");
const router = express.Router();
const Message = require("../../models/message");
const GroupInfo = require("../../models/groupInfo");
const Group = require("../../models/group");
const dbConnect = require("../utils/dbConnect");

dbConnect();

router.get("/", async (req, res) => {
  const groupInfo = await GroupInfo.findOne({ name: req.query.groupName });
  if (groupInfo) {
    const group = await Group.findOne({ groupInfo: groupInfo._id }).populate(
      "messages"
    );
    res.status(200).json({ success: true, response: group.messages });
  }
});

router.post("/", async (req, res) => {
  const newMessage = new Message({
    id: req.body.username,
    imagePath: req.body.imagePath,
    content: req.body.content,
  });
  const groupInfo = await GroupInfo.findOne({ name: req.body.groupName });
  newMessage.save(async (err) => {
    if (err) {
      console.log(err);
    }
    await Group.findOneAndUpdate(
      { groupInfo: groupInfo._id },
      { $push: { messages: newMessage._id } }
    );
    res.status(200).json({ success: true });
  });
});

module.exports = router;
