import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const addBlog = async (req, res) => {
    try {
      const { title, content, tags } = req.body;
      const image = req.file; // Get the uploaded file
      const authorId = req.user.id; // Extract user ID from auth middleware
  
      if (!image) {
        return res.status(400).json({ message: "Image is required" });
      }
  
      // Optimize and convert image to base64
      const optimizedImageBuffer = await sharp(image.buffer)
        .toFormat("jpeg", { quality: 80 }) // Compress image to 80% quality
        .toBuffer();
  
      // Convert buffer to base64 data URI
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
  
      // Create a unique folder for each user
      const userFolder = `Blogs/${authorId}`;
  
      // Upload to Cloudinary
      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: userFolder,
      });
  
      // Create a new blog post
      const newBlog = new Blog({
        title,
        content,
        Image: cloudResponse.secure_url, // Store Cloudinary URL
        author: authorId,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      });
  
      // Save blog to the database
      const savedBlog = await newBlog.save();
  
      // Link the blog to the user
      const user = await User.findById(authorId);
      if (user) {
        user.blogsId.push(savedBlog._id);
        await user.save();
      }
  
      // Populate author details before returning response
      await savedBlog.populate({ path: "author", select: "-password" });
  
      return res.status(201).json({
        message: "New blog added successfully",
        blog: savedBlog,
        success: true,
        cloudResponse,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
//ya feed page pa post dekha ge.
  export const getAllBlogPosts = async (req, res) => {
    try {
      const blogs = await Blog.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .populate({ path: "author", select: "username profileImage fullname" }) // Populate author details
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } }, // Sort comments by newest first
          populate: {
            path: "user",
            select: "username profileImage",
          },
        });
  
      return res.status(200).json({
        blogs,
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching blog posts" });
    }
  };

  export const getUserBlogPosts = async (req, res) => {
    try {
      const authorId = req.id; // Logged-in user's ID
  
      const blogs = await Blog.find({ author: authorId }) // Fetch blogs by author
        .sort({ createdAt: -1 }) // Sort newest first
        .populate({
          path: "author",
          select: "username profileImage", // Fetch author's username and profile image
        })
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } }, // Sort comments newest first
          populate: {
            path: "user",
            select: "username profileImage", // Fetch commenter details
          },
        });
  
      return res.status(200).json({
        blogs,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };


  export const likeBlogPost = async (req, res) => {
    try {
      const userId = req.id; // Logged-in user's ID
      const blogId = req.params.id; // Blog ID from request params
  
      const blog = await Blog.findById(blogId);
      if (!blog) return res.status(404).json({ message: "Blog not found", success: false });
  
      // Add user to the likes array if not already liked
      await blog.updateOne({ $addToSet: { likes: userId } });
      await blog.save();
  
      return res.status(200).json({ message: "Blog liked", success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", success: false });
    }
  };
  
  export const dislikeBlogPost = async (req, res) => {
    try {
      const userId = req.id; // Logged-in user's ID
      const blogId = req.params.id; // Blog ID from request params
  
      const blog = await Blog.findById(blogId);
      if (!blog) return res.status(404).json({ message: "Blog not found", success: false });
  
      // Remove user from the likes array if already liked
      await blog.updateOne({ $pull: { likes: userId } });
      await blog.save();
  
      return res.status(200).json({ message: "Blog disliked", success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", success: false });
    }
  };
  

  export const addBlogComment = async (req, res) => {
    try {
      const userId = req.id; // Logged-in user's ID
      const postId = req.params.id; // Blog Post ID from the request parameters
      const { commentText } = req.body; // The comment text from the request body
  
      if (!commentText) {
        return res.status(400).json({ message: "Comment text is required", success: false });
      }
  
      const blog = await Blog.findById(postId);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found", success: false });
      }
  
      // Create a new comment object
      const newComment = {
        user: userId, // The user who commented
        text: commentText, // The comment text
        createdAt: new Date(), // Timestamp for the comment
      };
  
      // Add the comment to the blog's comments array
      blog.comments.push(newComment);
  
      // Save the blog with the new comment
      await blog.save();
  
      // Populate the newly added comment with user details (username, profileImage)
      const populatedBlog = await Blog.findById(postId).populate({
        path: "comments.user",
        select: "username profileImage",
      });
  
      return res.status(200).json({
        message: "Comment added successfully",
        success: true,
        comments: populatedBlog.comments, // Return the updated comments array
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", success: false });
    }
  };

  export const getBlogComments = async (req, res) => {
    try {
      const postId = req.params.id; // Get the blog post ID from the request parameters
  
      const blog = await Blog.findById(postId).populate({
        path: "comments.user",
        select: "username profileImage",
      });
  
      if (!blog || !blog.comments || blog.comments.length === 0) {
        return res.status(404).json({ message: "No comments found for this blog", success: false });
      }
  
      return res.status(200).json({ success: true, comments: blog.comments });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", success: false });
    }
  };
  