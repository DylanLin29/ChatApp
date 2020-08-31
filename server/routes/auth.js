const express = require("express");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const dbConnect = require("../utils/dbConnect");
const isAuthenticated = require("../utils/isAuthenticated");
const User = require("../../models/user");

// Check users are logged in
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies["user-auth"], process.env.JWT_KEY);
    dbConnect();
    // Get groups info of the user
    const user = await User.findOne({ _id: decoded._id })
      .populate("groups")
      .populate("friends");
    const friendsList = _.map(
      user.friends,
      _.partialRight(_.pick, ["name", "imagePath"])
    );
    return res.status(200).json({
      name: decoded.name,
      imagePath: decoded.imagePath,
      _id: decoded._id,
      groups: user.groups,
      friends: friendsList,
    });
  } catch (err) {
    console.log(err);
  }
  return res.json(user);
});

module.exports = router;
