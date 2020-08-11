const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  confirmed: {
    required: true,
    type: Boolean,
  },
});

module.exports =
  mongoose.model.FriendRequest ||
  mongoose.model("FriendRequest", friendRequestSchema);
