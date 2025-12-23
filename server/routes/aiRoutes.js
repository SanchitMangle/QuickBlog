import express from 'express';
import { generatePost, optimizeSEO, summarizeContent, chatWithAI } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protection - only Editors and Admins can use AI tools to save costs/misuse
router.use(protect, authorize('admin', 'editor'));

router.post('/generate', generatePost);
router.post('/optimize', optimizeSEO);
router.post('/summarize', summarizeContent);
router.post('/chat', chatWithAI);

export default router;
