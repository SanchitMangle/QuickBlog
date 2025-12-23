import express from 'express'
import { addBlog, addComment, DeleteBlogById, generateContent, getAllBlogs, getAllComments, getBlogById, toggleIsPublished } from '../controllers/blogController.js';
import upload from '../config/multer.js';
import { protect, authorize } from '../middleware/auth.js';


const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), protect, authorize('admin', 'editor'), addBlog)
blogRouter.get('/all', getAllBlogs)
blogRouter.get('/:blogId', getBlogById)
blogRouter.post('/delete', protect, authorize('admin'), DeleteBlogById)
blogRouter.post('/toggle-publish', protect, authorize('admin', 'editor'), toggleIsPublished)
blogRouter.post('/add-comment', addComment)
blogRouter.post('/comments', getAllComments)
blogRouter.post('/generate', protect, authorize('admin', 'editor'), generateContent)


export default blogRouter