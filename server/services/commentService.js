import Comment from '../models/comment.js';

export const createComment = async (blogId, name, content) => {
    return await Comment.create({ blog: blogId, name, content });
};

export const getCommentsByBlogId = async (blogId) => {
    return await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
};
