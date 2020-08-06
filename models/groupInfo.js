const mongoose = require("mongoose");

const groupInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.model.GroupInfo || mongoose.model("GroupInfo", groupInfoSchema);
