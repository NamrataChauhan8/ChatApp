const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const message = mongoose.model("Message", messageSchema);
module.exports = message;
