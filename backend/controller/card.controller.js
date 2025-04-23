import mongoose from "mongoose";
import { Card } from "../models/card.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid"; // Corrected import
import fs from "fs/promises"; // For deleting temporary files

// Create card controller
export const createCard = async (req, res) => {
  const { tag, fullname, Image } = req.body;
  const userId = req.id; // Assuming user ID is available from authentication middleware

  try {
    // Check if user already has a card
    const existingCard = await Card.findOne({ owner: userId });
    if (existingCard) {
      return res
        .status(400)
        .json({ message: "User can only create one card." });
    }

    // Generate unique CardID
    const cardID = uuidv4();

    // Process image if provided
    let imageUrl = "";
    if (Image) {
      // Resize and upload to Cloudinary
      const buffer = await sharp(Buffer.from(Image, "base64"))
        .resize({ width: 500, height: 500, fit: "cover" })
        .toBuffer();

      const uploadResponse = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString("base64")}`,
        { folder: "cards" }
      );

      imageUrl = uploadResponse.secure_url;
    }

    // Create new card
    const newCard = new Card({
      cardID,
      Image: imageUrl,
      tag,
      fullname,
      owner: userId,
    });

    // Save card to database
    const savedCard = await newCard.save();

    // Update user's cardId field
    await User.findByIdAndUpdate(userId, { cardId: cardID });

    res
      .status(201)
      .json({ message: "Card created successfully.", card: savedCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Edit card controller
export const editCard = async (req, res) => {
  const { cardID } = req.params;
  const { tag, fullname } = req.body;
  const file = req.file; // Assuming the image file is sent as form-data under 'file'

  try {
    // Validate inputs
    if (!tag && !fullname && !file) {
      return res.status(400).json({ error: "No fields to update provided." });
    }

    // Find the card by cardID
    const card = await Card.findOne({ cardID });
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    // Process and upload image if file is provided
    if (file) {
      // Define a temporary file path for Sharp
      const tempFilePath = `temp/${Date.now()}-optimized.jpg`;

      // Resize and optimize the image using Sharp
      await sharp(file.path)
        .resize(800, 800, { fit: "inside" }) // Resize to max 800x800 while maintaining aspect ratio
        .jpeg({ quality: 80 }) // Compress to 80% quality
        .toFile(tempFilePath);

      // Upload the optimized image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        folder: "cards", // Optional: Cloudinary folder for organization
      });

      // Set the Cloudinary secure URL as the card's Image
      card.Image = uploadResult.secure_url;

      // Delete the temporary file
      await fs.unlink(tempFilePath);
    }

    // Update the fields
    if (tag) card.tag = tag;
    if (fullname) card.fullname = fullname;

    // Update the updatedAt field
    card.updatedAt = Date.now();

    // Save the changes
    const updatedCard = await card.save();

    return res.status(200).json({
      message: "Card updated successfully.",
      card: updatedCard,
    });
  } catch (error) {
    console.error(error);

    // Clean up temporary files in case of an error
    if (file) await fs.unlink(file.path).catch(() => {});

    return res.status(500).json({ error: "Server error. Please try again." });
  }
};

// Collect card
export const collectCard = async (req, res) => {
  try {
    const { cardId } = req.body; // Assuming the cardId is passed in the request body
    const userId = req.id; // Assuming you have middleware that sets req.user with the authenticated user

    // Find the card
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Check if the user already collected the card
    if (card.cardCollectors.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You already collected this card" });
    }

    // Add user to card collectors
    card.cardCollectors.push(userId);

    // Calculate the collect count based on cardCollectors array
    const updatedCollectCount = card.cardCollectors.length;

    // Update the collectCount field
    card.collectCounter = updatedCollectCount;

    await card.save();

    return res
      .status(200)
      .json({ message: "Card collected successfully", card });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Uncollect card
export const uncollectCard = async (req, res) => {
  try {
    const { cardId } = req.body;
    const userId = req.user.id;

    // Find the card
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Remove the user from card collectors
    card.cardCollectors = card.cardCollectors.filter(
      (collectorId) => !collectorId.equals(userId)
    );
    await card.save();

    return res
      .status(200)
      .json({ message: "Card uncollected successfully", card });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
