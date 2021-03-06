const _ = require("lodash");
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
    .status(200)
    .json({ success: false, message: "Groupchat not found" });
});

// Create a new group
router.post("/", async (req, res) => {
  try {
    const newGroupInfo = new GroupInfo({
      name: req.body.groupName,
      imagePath: req.body.imagePath,
    });

    await newGroupInfo.save();
    const newGroup = new Group({
      groupInfo: newGroupInfo._id,
      groupAdmin: req.body.userName,
      userlist: [req.body.userId],
    });
    await newGroup.save();

    // Update the user who creates the new group
    await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { groups: newGroupInfo._id } }
    );
    const user = await User.findOne({ _id: req.body.userId }).populate(
      "groups"
    );
    return res.status(200).json({ success: true, groups: user.groups });
  } catch (err) {
    console.log(err);
    return res.status(409).json({ success: false });
  }
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

// Users can retrieve the group members
router.get("/members", async (req, res) => {
  const group = await GroupInfo.findOne({ name: req.query.groupName });
  const completeGroup = await Group.findOne({
    groupInfo: group._id,
  }).populate("userlist");
  const userList = _.map(
    completeGroup.userlist,
    _.partialRight(_.pick, ["name", "imagePath"])
  );
  res.status(200).json({
    success: true,
    userList: userList,
    groupAdmin: completeGroup.groupAdmin,
  });
});

// Users can leave the group chat
router.post("/leave", async (req, res) => {
  const groupInfo = await GroupInfo.findOne({ name: req.body.groupName });
  const user = await User.findOne({ name: req.body.userName });
  await User.updateOne(
    { name: req.body.userName },
    { $pullAll: { groups: [groupInfo._id] } }
  );
  await Group.updateOne(
    { groupInfo: groupInfo._id },
    { $pullAll: { userlist: [user._id] } }
  );
  const updateUser = await User.findOne({ name: req.body.userName }).populate(
    "groups"
  );
  res.status(200).json({ success: true, groups: updateUser.groups });
});

// Admin can delete the group chat
router.post("/delete", async (req, res) => {
  const groupInfo = await GroupInfo.findOne({ name: req.body.groupName });
  const group = await Group.findOne({ groupInfo: groupInfo._id }).populate(
    "userlist"
  );
  const userList = _.map(group.userlist, _.partialRight(_.pick, "name"));

  await User.updateMany({}, { $pull: { groups: groupInfo._id } });
  await Group.findOneAndRemove({ groupInfo: groupInfo._id });
  await GroupInfo.findOneAndRemove({ _id: groupInfo._id });
  res.status(200).json({ success: true, userList: userList });
});

module.exports = router;
