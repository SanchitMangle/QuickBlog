import jwt from 'jsonwebtoken'
import Blog from '../models/blog.js'
import Comment from '../models/comment.js'
import Analytics from '../models/analytics.js'
import { getAnalyticsData } from '../services/analyticsService.js'

export const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRETE)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        es.json({ success: false, message: error.message })
    }

}

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blog = await Blog.find({}).sort({ createdAt: -1 })
        res.json({ success: true, blog })
    } catch (error) {
        console.log(error);
        es.json({ success: false, message: error.message })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 })
        res.json({ success: true, comments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5)
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.find({ isPublished: false }).countDocuments()

        // Get last 7 days of analytics
        const analytics = await getAnalyticsData(7);

        const dashboardData = {
            blogs, recentBlogs, comments, drafts, analytics
        }
        res.json({ success: true, dashboardData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body
        await Comment.findByIdAndDelete(id)
        res.json({ success: true, message: "Comment Deleted Successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body
        await Comment.findByIdAndUpdate(id, { isApproved: true })
        res.json({ success: true, message: "Comment Approved Successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getAnalyticsPageData = async (req, res) => {
    try {
        // Last 30 Days Trend
        const trendData = await getAnalyticsData(30);

        // Aggregations
        const totalStats = await Analytics.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalLikes: { $sum: "$likes" },
                    totalComments: { $sum: "$comments" },
                    mobile: { $sum: "$mobileViews" },
                    desktop: { $sum: "$desktopViews" },
                    tablet: { $sum: "$tabletViews" }
                }
            }
        ]);

        const stats = totalStats.length > 0 ? totalStats[0] : { totalViews: 0, totalLikes: 0, totalComments: 0, mobile: 0, desktop: 0, tablet: 0 };

        res.json({ success: true, analyticsData: { trendData, stats } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};