const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.model.Message || mongoose.model("Message", MessageSchema);
