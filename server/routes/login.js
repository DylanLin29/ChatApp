const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const dbConnect = require("../utils/dbConnect");
const createToken = require("../utils/createToken");
const User = require("../../models/user");

dbConnect();

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (user && bcrypt.compare(user.password, req.body.password)) {
      // Create token and save as cookies
      createToken(res, user.name, user.imagePath, user._id);
      return res.status(200).json({ success: true });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid Password or Username" });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Password or Username" });
  }
});

module.exports = router;
