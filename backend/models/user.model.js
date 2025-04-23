import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true }, // Unique user identifier
  fullname: { type: String, required: true }, // Full name of the user
  email: { type: String, required: true, unique: true }, // Email address of
  password: { type: String, required: true }, // Password of the user
  backgroundImage: { type: String }, // URL for the background image
  famePercentage: { type: Number, default: 0 }, // Fame percentage of the user
  bio: { type: String }, // Bio of the user
  postsImageID: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostImage" }], // Reference to the user's postsImage Id
  postsVideoID: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostVideo" }], // Reference to the user's postsVideo Id
  blogsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], //Reference to the user's Blogs Id
  gender: { type: String, default: "" },
  status: { type: String, default: "active" }, // Status of the user
  createdAt: { type: Date, default: Date.now }, // Timestamp for the user creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
  cardID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }], // Cards owned by the user
  cardCollection: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }], // Cards collected by the user "jo main user card collect karega"
  location: {
    lat: Number,
    lng: Number,
  }, // Location of the user
});

export const User = mongoose.model("User", userSchema);
