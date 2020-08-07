const express = require("express");
const router = express.Router();
const Group = require("../../models/group");
const GroupInfo = require("../../models/groupInfo");
const User = require("../../models/user");
const dbConnect = require("../utils/dbConnect");

dbConnect();

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

  res.status(200).json({ success: true });
});

module.exports = router;
