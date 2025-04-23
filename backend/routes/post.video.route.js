import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { addNewVideoPost, addVideoComment, dislikeVideoPost, getAllVideoPosts, getCommentsOfVideoPost, getUserVideoPost, likeVideoPost } from '../controller/post.video.controller.js';
import upload from '../middleware/multerVideo.js';

const router = express.Router();

router.route('/addVideoNewPost').post(isAuthenticated, upload.single('video'), addNewVideoPost);
router.route('/getAllVideoPost').get(isAuthenticated, getAllVideoPosts);
router.route('/getUserVideoPost/all').get(isAuthenticated, getUserVideoPost);
router.route('/:id/like').get(isAuthenticated, likeVideoPost);
router.route('/:id/dislike').get(isAuthenticated, dislikeVideoPost);
router.route('/:id/comment').post(isAuthenticated, addVideoComment);
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfVideoPost);

export default router;