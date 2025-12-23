import Interaction from '../models/interaction.js';
import Blog from '../models/blog.js';

export const toggleLike = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user.id;

        const existingInteraction = await Interaction.findOne({
            user: userId,
            blog: blogId,
            type: 'like'
        });

        if (existingInteraction) {
            await Interaction.findByIdAndDelete(existingInteraction._id);
            await Blog.findByIdAndUpdate(blogId, { $inc: { 'stats.likes': -1 } });
            return res.json({ success: true, message: 'Unliked', liked: false });
        } else {
            await Interaction.create({ user: userId, blog: blogId, type: 'like' });
            await Blog.findByIdAndUpdate(blogId, { $inc: { 'stats.likes': 1 } });
            return res.json({ success: true, message: 'Liked', liked: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const toggleBookmark = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user.id;

        const existingInteraction = await Interaction.findOne({
            user: userId,
            blog: blogId,
            type: 'bookmark'
        });

        if (existingInteraction) {
            await Interaction.findByIdAndDelete(existingInteraction._id);
            return res.json({ success: true, message: 'Removed from bookmarks', bookmarked: false });
        } else {
            await Interaction.create({ user: userId, blog: blogId, type: 'bookmark' });
            return res.json({ success: true, message: 'Bookmarked', bookmarked: true });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUserInteractions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { blogId } = req.query;

        if (blogId) {
            // Check status for specific blog
            const liked = await Interaction.exists({ user: userId, blog: blogId, type: 'like' });
            const bookmarked = await Interaction.exists({ user: userId, blog: blogId, type: 'bookmark' });
            return res.json({ success: true, status: { liked: !!liked, bookmarked: !!bookmarked } });
        }

        // Get all interactions
        const interactions = await Interaction.find({ user: userId }).populate('blog');
        res.json({ success: true, interactions });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
