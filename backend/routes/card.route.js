import express from 'express';
import upload from '../middleware/multer.js';
import { collectCard, createCard, editCard, uncollectCard } from '../controller/card.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router =  express.Router();

router.route('/createCard').post(isAuthenticated, upload.single("file"), createCard);
router.route('/editCard/:cardID').post(isAuthenticated, upload.single("file"), editCard);
router.route('/collectCard/:cardID').post(isAuthenticated, collectCard);
router.route('/uncollectCard/:cardID').delete(isAuthenticated, uncollectCard);

export default router;