const express = require("express");
const router = express.Router();
const Group = require("../../models/group");
const GroupInfo = require("../../models/groupInfo");
const User = require("../../models/user");
const dbConnect = require("../utils/dbConnect");

dbConnect();

// Return Groups when users search
router.get("/", async (req, res) => {
  const group = await GroupInfo.findOne({ name: req.query.groupName });
  if (group) {
    const completeGroup = await Group.findOne({ groupInfo: group._id });
    return res.status(200).json({
      success: true,
      group: {
        name: group.name,
        imagePath: group.imagePath,
        size: completeGroup.userlist.length,
      },
    });
  }
  return res
    .status(404)
    .json({ success: false, message: "Groupchat not found" });
});

// Create a new group
router.post("/", async (req, res) => {
  const newGroupInfo = new GroupInfo({
    name: req.body.name,
    imagePath: req.body.imagePath,
  });
  newGroupInfo.save((err) => {
    if (err) {
      console.log(err);
    }
    const newGroup = new Group({
      groupInfo: newGroupInfo._id,
      userlist: [req.body._id],
    });
    newGroup.save((err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  // Update the user who creates the new group
  await User.findOneAndUpdate(
    { _id: req.body._id },
    { $push: { groups: newGroupInfo._id } }
  );

  const user = await User.findOne({ _id: req.body._id }).populate("groups");

  res.status(200).json({ groups: user.groups });
});

// Users join a group chat
router.post("/join", async (req, res) => {
  const groupInfo = await GroupInfo.findOne({ name: req.body.groupName });
  await Group.findOneAndUpdate(
    { groupInfo: groupInfo._id },
    { $push: { userlist: req.body.userId } }
  );
  await User.findOneAndUpdate(
    { _id: req.body.userId },
    { $push: { groups: groupInfo._id } }
  );
  const user = await User.findOne({ _id: req.body.userId }).populate("groups");
  res.status(200).json({ groups: user.groups });
});

module.exports = router;
