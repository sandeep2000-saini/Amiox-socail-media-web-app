import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  cardID: { type: String, required: true, unique: true },
  Image: { type: String, default:"" },
  tag: { type: String, required: true },
  fullname: { type: String, required: true },
  owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
  cardKeeper: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // array of userIDs and cardKeeper is the user who is currently holding the card 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Card = mongoose.model("Card", cardSchema);
