import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { addBlog, addBlogComment, dislikeBlogPost, getAllBlogPosts, getBlogComments, getUserBlogPosts, likeBlogPost } from "../controller/post.blog.controller.js";


const router = express.Router();

router.route("/addBlog").post(isAuthenticated, upload.single("image"),addBlog);
router.route("/getAllBlogPosts").get(isAuthenticated,getAllBlogPosts);
router.route("/getUserBlogPosts/all").get(isAuthenticated,getUserBlogPosts);
router.route(":id/likeBlogPost").get(isAuthenticated, likeBlogPost);
router.route(":id/dislikeBlogPost").get(isAuthenticated, dislikeBlogPost);
router.route(":id/addBlogComment").post(isAuthenticated, addBlogComment);
router.route(":id/getBlogComments/all").post(isAuthenticated, getBlogComments);

export default router;