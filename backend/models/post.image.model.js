import mongoose from "mongoose";

const postImageSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }, // Reference to the user who created the post
  caption: { type: String}, // Caption for the post
  image: { type: String}, // URL of the image for the post
  tags: [{ type: String }], // Tags associated with the post
  postType:{ type: String},
  likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  comments: [
    {
      userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }, // Commenter's user ID
      content: { type: String, required: true }, // Comment text
      username:{type: mongoose.Schema.Types.String, ref:"User"},
      avatar:{type:mongoose.Schema.Types.String, ref:"User"},      
      createdAt: { type: Date, default: Date.now }, // Timestamp for the comment
    },
  ],
  postSchedule: { type: Date}, // Date and time to schedule the post
  mood: {type: String,default: "",}, // Mood associated with the post
  visibility: {type: String}, // Post visibility
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the post was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for when the post was last updated
});
export const PostImage = mongoose.model("PostImage", postImageSchema);
