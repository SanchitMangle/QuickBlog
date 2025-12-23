import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isPublished: { type: Boolean, default: false }, // Keeping backward compatibility but defaulting to false
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'published', 'archived'],
        default: 'draft'
    },
    slug: { type: String, unique: true, sparse: true }, // Sparse to allow existing docs to not fail validation immediately
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String }],
    seo: {
        title: { type: String },
        description: { type: String },
        keywords: [{ type: String }]
    },
    stats: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
    },
    scheduledAt: { type: Date }
}, { timestamps: true });

// Index for faster searching/filtering
blogSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;