const jwt = require("jsonwebtoken");
const dbConnect = require("./dbConnect");
const User = require("../../models/user");

async function isAuthenticated(req, res, next) {
  try {
    console.log("Enter is authenticated");
    const decoded = jwt.verify(req.cookies["user-auth"], process.env.JWT_KEY);
    dbConnect();
    const user = await User.findOne({ _id: decoded._id });
    if (user.name) {
      return next();
    }
    res.redirect("/login");
  } catch (err) {
    res.redirect("http://localhost:3000/login");
  }
}

module.exports = isAuthenticated;
