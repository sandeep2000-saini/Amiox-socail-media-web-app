import express from "express";
import isAuthenticated from '../middleware/isAuthenticated.js';
import { addComment, addNewPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../controller/post.image.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.route("/addNewPost").post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/getAllPost").get(isAuthenticated, getAllPost);
router.route("/getUserPost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);  
router.route("/delete/:id").delete(isAuthenticated, deletePost);

export default router;