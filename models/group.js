const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupInfo",
  },
  userlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model.Group || mongoose.model("Group", groupSchema);
