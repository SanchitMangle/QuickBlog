import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import { uploadImage } from './mediaService.js';

export const createBlog = async (blogData, imageFile) => {
    let image = '';

    if (imageFile) {
        image = await uploadImage(imageFile);
    }

    const blog = await Blog.create({
        ...blogData,
        image,
        isPublished: blogData.isPublished || false
    });

    return blog;
};

export const getAllPublishedBlogs = async () => {
    return await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
};

export const getBlogById = async (id) => {
    return await Blog.findById(id).populate('author', 'name avatar');
};

export const deleteBlog = async (id) => {
    await Comment.deleteMany({ blog: id });
    return await Blog.findByIdAndDelete(id);
};

export const togglePublishStatus = async (id) => {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Blog not found');

    blog.isPublished = !blog.isPublished;
    return await blog.save();
};
