const express = require("express");
const router = express.Router();
const Group = require("../../models/group");
const GroupInfo = require("../../models/groupInfo");
const User = require("../../models/user");
const dbConnect = require("../utils/dbConnect");
const groupInfo = require("../../models/groupInfo");

dbConnect();

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

router.post("/", async (req, res) => {
  // Create a new group
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

  // Update the user creates the new group
  await User.findOneAndUpdate(
    { _id: req.body._id },
    { $push: { groups: newGroupInfo._id } }
  );

  const user = await User.findOne({ _id: req.body._id }).populate("groups");

  res.status(200).json({ groups: user.groups });
});

module.exports = router;
