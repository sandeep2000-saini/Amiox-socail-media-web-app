const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // List of user IDs involved in the conversation
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // List of messages in the conversation
  lastMessage: { type: String }, // Store last message text for quick preview
  lastMessageAt: { type: Date }, // Timestamp for last message
  isGroupChat: { type: Boolean, default: false }, // Whether the conversation is a group chat
  groupName: { type: String }, // Name of the group (optional)
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

export default conversation = mongoose.model('Conversation', conversationSchema);
