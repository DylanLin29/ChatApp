const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  imagePath: {
    type: String,
    required: true,
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupInfo" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "FriendRequest" }],
});

module.exports = mongoose.model.User || mongoose.model("User", userSchema);
