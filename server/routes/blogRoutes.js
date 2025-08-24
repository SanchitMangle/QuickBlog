import express from 'express'
import { addBlog, addComment, DeleteBlogById, generateContent, getAllBlogs, getAllComments, getBlogById,toggleIsPublished } from '../controllers/blogController.js';
import upload from '../config/multer.js';
import { adminAuth } from '../middleware/auth.js';


const blogRouter = express.Router();

blogRouter.post('/add',upload.single('image'),adminAuth, addBlog)
blogRouter.get('/all',getAllBlogs)
blogRouter.get('/:blogId',getBlogById)
blogRouter.post('/delete',adminAuth,DeleteBlogById)
blogRouter.post('/toggle-publish',adminAuth,toggleIsPublished)
blogRouter.post('/add-comment',addComment)
blogRouter.post('/comments',getAllComments)
blogRouter.post('/generate',adminAuth,generateContent)


export default blogRouter