import express from 'express';
import { editProfile, getProfile, getSuggestedUsers, login, logout, register } from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/multer.js';


const router = express.Router();


router.route('/register').post(register); // Register a user
router.route('/login').post(login); // Log in a user
router.route('/logout').get(logout); // Log out a user
router.route('/:id/profile').get(isAuthenticated, getProfile); // Get a user's profile
router.route('/profile/edit').post(isAuthenticated, upload.single('file'), editProfile); // Edit a user's profile
router.route('/suggested').get(isAuthenticated, getSuggestedUsers); // Get suggested users



export default router;