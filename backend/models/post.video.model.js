import mongoose from "mongoose";

const postVideoSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the post
  videoUrl: { type: String, required: true }, // URL of the video for the post
  videoTitle: { type: String, required: true, trim: true }, // Title of the video
  videoDescription: { type: String, trim: true }, // Description of the video
  tags: [{ type: String }], // Tags associated with the post
  postFor:{ type: String}, // Post for (for all, only 18+)...
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 }, // New Field for View Count
  comments: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Commenter's user ID
      content: { type: String, required: true }, // Comment text
      username: { type: String, ref: "User" },
      avatar: { type: String, ref: "User" },
      createdAt: { type: Date, default: Date.now }, // Timestamp for the comment
    },
  ],
  postSchedule: { type: Date}, // Date and time to schedule the post
  mood: {type: String,default: "",}, // Mood associated with the post
  visibility: {type: String}, // Post visibility
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the post was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for when the post was last updated
});

export const PostVideo = mongoose.model("PostVideo", postVideoSchema);