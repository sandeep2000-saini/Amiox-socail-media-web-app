import ffmpeg from "fluent-ffmpeg";
import { unlink } from "fs/promises";
import path from "path";
import cloudinary from "../utils/cloudinary.js";
import { PostVideo } from "../models/post.video.model.js";
import { User } from "../models/user.model.js";

export const addNewVideoPost = async (req, res) => {
  try {
    const { videoTitle, videoDescription, postFor, tags, postSchedule, mood, visibility } = req.body;
    const video = req.file;
    const authorId = req.id;

    if (!video) return res.status(400).json({ message: "Video file is required" });

    // ✅ Define absolute path for compressed video
    const compressedVideoPath = path.resolve(`uploads/compressed_${Date.now()}.mp4`);

    console.log("Starting video compression...");

    // ✅ Compress video using FFmpeg with error handling
    await new Promise((resolve, reject) => {
      ffmpeg(video.path)
        .output(compressedVideoPath)
        .videoCodec("libx264")
        .audioCodec("aac")
        .size("1280x720")
        .outputOptions("-crf 28")
        .on("end", () => {
          console.log("Compression completed:", compressedVideoPath);
          resolve();
        })
        .on("error", (err) => {
          console.error("FFmpeg Compression Error:", err);
          reject(err);
        })
        .run();
    });

    console.log("Uploading to Cloudinary...");

    // ✅ Upload compressed video to Cloudinary
    const userFolder = `Videos/${authorId}`;
    const cloudResponse = await cloudinary.uploader.upload(compressedVideoPath, {
      resource_type: "video",
      folder: userFolder,
      public_id: `video_${Date.now()}`,
    });

    console.log("Upload Successful:", cloudResponse.secure_url);

    // ✅ Clean up local files (Ensure cleanup even if an error occurs)
    try {
      await unlink(compressedVideoPath);
      await unlink(video.path);
      console.log("Local files deleted.");
    } catch (cleanupError) {
      console.warn("Cleanup Failed:", cleanupError.message);
    }

    // ✅ Create new video post
    const post = await PostVideo.create({
      authorId,
      videoUrl: cloudResponse.secure_url,
      videoTitle,
      postFor,
      videoDescription,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      postSchedule,
      mood,
      visibility,
      createdAt: new Date(),
    });

    await post.save();

    // ✅ Link the post to the user
    const user = await User.findById(authorId);
    if (user) {
      user.postsVideoID.push(post._id);
      await user.save();
    }

    // ✅ Populate author details (Exclude sensitive fields)
    await post.populate({ path: "authorId", select: "-password" });

    console.log("Post created successfully.");

    return res.status(201).json({
      message: "New video post added",
      post,
      success: true,
      cloudResponse,
    });
  } catch (error) {
    console.error("Error creating video post:", error);
    return res.status(500).json({
      message: "Failed to add video",
      error: error.message,
    });
  }
};


  export const getAllVideoPosts = async (req, res) => {
    try {
      const posts = await PostVideo.find({}) // Fetch only video posts
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .populate({ path: "authorId", select: "userID backgroundImage fullname" }) // Populate author information
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } }, // Sort comments by creation date
          populate: {
            path: "userID",
            select: "userID backgroundImage fullname", // Populate user details in comments
          },
        });
  
      return res.status(200).json({
        posts,
        success: true,
      });
    } catch (error) {
      console.error("Error fetching video posts:", error);
      return res.status(500).json({
        message: "An error occurred while fetching video posts",
        success: false,
      });
    }
  };

  export const getUserVideoPost = async (req, res) => {
    try {
      const authorId = req.id;
      const posts = await PostVideo.find({ authorId: authorId })  // Assuming 'PostVideo' is your model for video posts
        .sort({ createdAt: -1 })
        .populate({
          path: "authorId",  // Assuming 'authorId' is a reference to the user model
          select: "fullname backgroundImage fullname",
        })
        .populate({
          path: "comments",
          sort: { createdAt: -1 },
          populate: {
            path: "userID",  // Assuming 'userID' is a reference to the user who made the comment
            select: "fullname backgroundImage fullname",
          },
        });
      return res.status(200).json({
        posts,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };


  export const likeVideoPost = async (req, res) => {
    try {
      const likeKrneWalaUserKiId = req.id;  // Logged-in user's ID
      const postId = req.params.id;  // Post ID from the request parameters
  
      const post = await PostVideo.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found', success: false });
  
      // Add user to the likes array if not already liked
      await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
      await post.save();
  
      return res.status(200).json({ message: 'Post liked', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error', success: false });
    }
  };
  
  export const dislikeVideoPost = async (req, res) => {
    try {
      const dislikeKrneWalaUserKiId = req.id;  // Logged-in user's ID
      const postId = req.params.id;  // Post ID from the request parameters
  
      const post = await PostVideo.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found', success: false });
  
      // Remove user from the likes array if already liked (for toggling like/dislike)
      await post.updateOne({ $pull: { likes: dislikeKrneWalaUserKiId } });
      await post.save();
  
      return res.status(200).json({ message: 'Post disliked', success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error', success: false });
    }
  };
  
  export const addVideoComment = async (req, res) => {
    try {
      const userId = req.id;  // Logged-in user's ID
      const postId = req.params.id;  // Post ID from the request parameters
      const { commentText } = req.body;  // The comment text from the request body
  
      if (!commentText) {
        return res.status(400).json({ message: "Comment text is required", success: false });
      }
  
      const post = await PostVideo.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found', success: false });
      }
  
      // Create a new comment object
      const newComment = {
        userID: userId,  // The user who commented
        content: commentText,  // The comment text
        createdAt: new Date(),  // Timestamp for the comment
      };
  
      // Add the comment to the post's comments array
      post.comments.push(newComment);
  
      // Save the post with the new comment
      await post.save();
  
      // Populate the newly added comment with user details (fullname, profile picture)
      const populatedPost = await PostVideo.findById(postId)
        .populate({
          path: 'comments.userID',  // Populate the user details for each comment
          select: 'fullname profilePicture',  // Select only the needed fields
        });
  
      return res.status(200).json({
        message: 'Comment added successfully',
        success: true,
        comments: populatedPost.comments,  // Return the updated comments array
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error', success: false });
    }
  };
  
  export const getCommentsOfVideoPost = async (req, res) => {
    try {
      const postId = req.params.id;  // Get the post ID from the request parameters
  
      const post = await PostVideo.findById(postId).populate({
        path: 'comments.userID',  // Populate the user details for each comment
        select: 'fullname profilePicture',  // Only select the necessary fields
      });
  
      if (!post || !post.comments || post.comments.length === 0) {
        return res.status(404).json({ message: 'No comments found for this post', success: false });
      }
  
      return res.status(200).json({ success: true, comments: post.comments });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error', success: false });
    }
  };
  