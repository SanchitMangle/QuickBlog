import * as blogService from '../services/blogService.js';
import * as commentService from '../services/commentService.js';
import * as analyticsService from '../services/analyticsService.js';
import main from '../config/gemini.js';
import asyncHandler from '../utils/asyncHandler.js';

export const addBlog = asyncHandler(async (req, res) => {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !subTitle || !description || !category) {
        res.status(400);
        throw new Error("Missing Required Fields");
    }

    const blogData = { title, subTitle, description, category, isPublished };
    const newBlog = await blogService.createBlog(blogData, imageFile);

    res.json({ success: true, message: 'Blog Added Successfully', blog: newBlog });
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await blogService.getAllPublishedBlogs();
    res.json({ success: true, blogs });
});

export const getBlogById = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    // Track visit asynchronously (fire and forget)
    analyticsService.trackVisit(req.headers['user-agent']);

    const blog = await blogService.getBlogById(blogId);

    if (!blog) {
        res.status(404);
        throw new Error("Blog Not Found");
    }

    res.json({ success: true, blog });
});

export const DeleteBlogById = asyncHandler(async (req, res) => {
    const { id } = req.body;
    await blogService.deleteBlog(id);
    res.json({ success: true, message: 'Blog Deleted Successfully' });
});

export const toggleIsPublished = asyncHandler(async (req, res) => {
    const { id } = req.body;
    await blogService.togglePublishStatus(id);
    res.json({ success: true, message: 'Blog Status Updated' });
});

export const addComment = asyncHandler(async (req, res) => {
    const { blog, name, content } = req.body;
    await commentService.createComment(blog, name, content);
    res.json({ success: true, message: "Comment Added For Review" });
});

export const getAllComments = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const comments = await commentService.getCommentsByBlogId(blogId);
    res.json({ success: true, comments });
});

// Deprecate this favor of aiController? Or keep for legacy routes?
export const generateContent = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
    res.json({ success: true, content });
});