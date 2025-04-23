const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // User sending the message
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // User receiving the message
  conversationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  }, // Reference to conversation
  content: { type: String }, // Message content (text)
  mediaURL: { type: String }, // URL for any media (e.g., image/video)
  createdAt: { type: Date, default: Date.now }, // Timestamp
  read: { type: Boolean, default: false }, // Read/unread status
});

export default Message = mongoose.model("Message", messageSchema);
// In this model, we define a schema for messages exchanged between users. Each message has a sender, receiver, conversation ID, content, media URL, timestamp, and read status. The senderID, receiverID, and conversationID fields are references to the User and Conversation models, respectively. This allows us to establish relationships between messages, users, and conversations.