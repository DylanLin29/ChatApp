const express = require("express");
const router = express.Router();
const dbConnect = require("../utils/dbConnect");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

dbConnect();

router.post("/", async (req, res) => {
  console.log("register endpoint called");
  const newUser = await User.create(req.body);
  await newUser.save();

  const token = jwt.sign({ name: newUser.name }, "jwtkey", {
    expiresIn: "60d",
  });
  res.cookie("x-auth", token);
  // res.setHeader(
  //   "Set-Cookie",
  //   cookie.serialize("x-auth", token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV !== "development",
  //     sameSite: "strict",
  //     maxAge: 3600,
  //     path: "/",
  //   })
  // );
  res.json({ success: true });
});

module.exports = router;
