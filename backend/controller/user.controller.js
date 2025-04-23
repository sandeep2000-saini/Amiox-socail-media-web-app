import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // Import the User model
import getDataUri from "../utils/datauri.js"; // Import the getDataUri function
import cloudinary from "../utils/cloudinary.js"; // Import the cloudinary object
import { PostImage } from "../models/post.image.model.js";

// JWT secret and expiration (from .env)
const JWT_SECRET =
  process.env.JWT_SECRET_KEY ||
  "z7mL$9X@wq3aR8t2C!B4E*Y0p20012000G5nF%yQzZ6V!m";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Controller to register a user
export const register = async (req, res) => {
  const { fullname, userID, password, email } = req.body;

  try {
    // Check for required fields
    if (!fullname || !userID || !password || !email) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ userID }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      fullname,
      userID,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Return success response
    return res.status(201).json({
      message: "User registered successfully.",
      success: true,
      UserId: newUser._id,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to log in a user
export const login = async (req, res) => {
  const { userID, password } = req.body;

  try {
    // Check for required fields
    if (!userID || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user exists
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(400).json({ message: "Invalid userId or password." });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid userId or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, userId: user.userID, fullname: user.fullname },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    const populatedPosts = await Promise.all(
      user.postsImageID.map(async (postId) => {
        const post = await PostImage.findById(postId);
        if (post.authorId.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    // Refine user object
    const refinedUser = {
      id: user._id,
      userId: user.userID,
      fullname: user.fullname,
      email: user.email,
      backgroundImage: user.backgroundImage,
      totalCards: user.totalCards,
      totalFire: user.totalFire,
      famePercentage: user.famePercentage,
      bio: user.bio,
      postsImageID: populatedPosts,
    };

    // Send the token in a cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Return success response
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: refinedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to log out a user
export const logout = async (_, res) => {
  try {
    // Clear the cookie
    return res.cookie("token", "", { maxAge: 0 }).json({ 
      message: "Logout successfully", 
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to get a user's profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:'postsImageID', createdAt:-1});
    return res.status(200).json({
        user,
        success: true
    });
} catch (error) {
    console.log(error);
}
};

// Controller to edit a user's profile
export const editProfile = async (req, res) => {
  try {
    const userID = req.id;
    const { userId, fullname, bio, gender } = req.body;
    const backgroundImage = req.file;
    let cloudResponse;

    if (backgroundImage) {
      const fileUri = getDataUri(backgroundImage);
      const userFolder = `BackgroundImages/${userID}`;
      cloudResponse = await cloudinary.uploader.upload(fileUri,{
        folder: userFolder, // User-specific folder
      });
    }

    const user = await User.findById(userID).select("-password");
    if (!user) {
      console.log(`User with id ${userID} not found.`);
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    if (userId) user.userID = userId;
    if (fullname) user.fullname = fullname;
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (backgroundImage) user.backgroundImage = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Background Image updated.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(`Error editing user with id ${req.id}:`, error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to getSuggest  user's profile
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};
