const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  friendName: {
    type: String,
  },
  adminName: {
    type: String,
  },
  groupName: {
    type: String,
  },
});

module.exports =
  mongoose.model.Notification ||
  mongoose.model("Notification", notificationSchema);
