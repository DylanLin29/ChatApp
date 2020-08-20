const mongoose = require("mongoose");

const PrivateMessageSchema = new mongoose.Schema({
  content: {
    required: true,
    type: String,
  },
  time: {
    type: Number,
    required: true,
  },
  friendName: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.model.PrivateMessage ||
  mongoose.model("PrivateMessage", PrivateMessageSchema);
