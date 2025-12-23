import express from 'express'
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard, getAnalyticsPageData } from '../controllers/adminController.js';
import { seedDatabase } from '../controllers/seedController.js';
import { protect, authorize } from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/comments', protect, authorize('admin'), getAllComments);
adminRouter.get('/blogs', protect, authorize('admin'), getAllBlogsAdmin);
adminRouter.post('/delete-comment', protect, authorize('admin'), deleteCommentById);
adminRouter.post('/approve-comment', protect, authorize('admin'), approveCommentById);
adminRouter.get('/analytics-details', protect, authorize('admin'), getAnalyticsPageData);
adminRouter.get('/dashboard', protect, authorize('admin'), getDashboard);

// Seeder
adminRouter.get('/run-seed', seedDatabase);

export default adminRouter