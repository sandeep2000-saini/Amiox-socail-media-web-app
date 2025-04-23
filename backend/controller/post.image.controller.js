import sharp from "sharp";
import { PostImage } from "../models/post.image.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption, postType, tags, postSchedule, mood, visibility } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    // Optimize and convert image to base64
    const optimizedImageBuffer = await sharp(image.buffer)
    .toFormat('jpeg', { quality: 80 })// Compress to 80% quality (adjust as needed)
    .toBuffer();// Convert to Buffer

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    // Create a unique folder for each user
    const userFolder = `Images/${authorId}`;

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      folder: userFolder, // User-specific folder
    });

    // Create post in the database
    const post = await PostImage.create({
      caption: caption,
      postType: postType, // Add postType
      image: cloudResponse.secure_url,
      authorId :authorId,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [], // Split tags by commas
      postSchedule: postSchedule,
      mood: mood, // Default mood if none provided
      visibility:  visibility // Default visibility
    });

    await post.save();

    

    // Link post to user
    const user = await User.findById(authorId);
    if (user) {
      user.postsImageID.push(post._id);
      await user.save();
    }

    // Populate author details in the post response
    await post.populate({ path: "authorId", select: "-password" });
    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
      cloudResponse,
    });
    
  } catch (error) {
    console.log(error);
  }
};


//ya feed page pa post dekha ge.
export const getAllPost = async (req, res) => {
  try {
    const posts = await PostImage.find()
      .sort({ createdAt: -1 })
      .populate({ path: "authorId", select: "userID backgroundImage" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userID",
          select: "UserID backgroundImage",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// ya user ki profile mai dekha ga
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await PostImage.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "authorId",
        select: "fullname backgroundImage",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userID",
          select: "fullname backgroundImage",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
      const likeKrneWalaUserKiId = req.id;
      const postId = req.params.id; 
      const post = await PostImage.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found', success: false });

      // like logic started
      await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
      await post.save();

      // // implement socket io for real time notification
      // const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
       
      // const postOwnerId = post.authorId.toString();
      // if(postOwnerId !== likeKrneWalaUserKiId){
      //     // emit a notification event
      //     const notification = {
      //         type:'like',
      //         userId:likeKrneWalaUserKiId,
      //         userDetails:user,
      //         postId,
      //         message:'Your post was liked'
      //     }
      //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      //     io.to(postOwnerSocketId).emit('notification', notification);
      // }

      return res.status(200).json({message:'Post liked', success:true});
  } catch (error) {
    console.log(error);

  }
}
export const dislikePost = async (req, res) => {
  try {
      const likeKrneWalaUserKiId = req.id;
      const postId = req.params.id;
      const post = await PostImage.findById(postId);
      if (!post) return res.status(404).json({ message: 'Post not found', success: false });

      // like logic started
      await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
      await post.save();

      // // implement socket io for real time notification
      // const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
      // const postOwnerId = post.author.toString();
      // if(postOwnerId !== likeKrneWalaUserKiId){
      //     // emit a notification event
      //     const notification = {
      //         type:'dislike',
      //         userId:likeKrneWalaUserKiId,
      //         userDetails:user,
      //         postId,
      //         message:'Your post was liked'
      //     }
      //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      //     io.to(postOwnerSocketId).emit('notification', notification);
      // }



      return res.status(200).json({message:'Post disliked', success:true});
  } catch (error) {
    console.log(error);

  }
}

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;
    const { text } = req.body;

    if (!text)
      return res
        .status(400)
        .json({ message: "Text is required", success: false });

    const post = await PostImage.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });


        // Find the commenting user
    const user = await User.findById(commentKrneWalaUserKiId).select(
      "userID backgroundImage "
    );

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const comment = {
      content: text,
      userID: commentKrneWalaUserKiId,
      username: user.userID, // Adding the username
      avatar: user.backgroundImage, // Optional: Add avatar if available
      createdAt: Date.now(),
    };

    await post.populate({
      path: "comments.userID",
      select: "userID backgroundImage",
    });

    post.comments.push(comment);
    await post.save();

    return res.status(201).json({
      message: "Comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "userID",
      "fullname, backgroundImage"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await PostImage.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // check if the logged-in user is the owner of the post
    if (post.authorId.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });

    // delete post
    await PostImage.findByIdAndDelete(postId);

    // remove the post id from the user's post
    let user = await User.findById(authorId);
    user.postsImageID = user.postsImageID.filter(
      (id) => id.toString() !== postId
    );
    await user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
