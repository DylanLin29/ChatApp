const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupInfo",
  },
  groupAdmin: {
    type: String,
    required: true,
  },
  userlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model.Group || mongoose.model("Group", groupSchema);
