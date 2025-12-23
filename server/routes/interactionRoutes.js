import express from 'express';
import { toggleLike, toggleBookmark, getUserInteractions } from '../controllers/interactionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All interaction routes require auth

router.post('/like', toggleLike);
router.post('/bookmark', toggleBookmark);
router.get('/status', getUserInteractions);

export default router;
