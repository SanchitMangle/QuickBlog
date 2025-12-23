import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to registered user
    name: { type: String }, // For guests or legacy comments
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment;