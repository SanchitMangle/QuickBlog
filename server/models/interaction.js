import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    type: {
        type: String,
        enum: ['like', 'bookmark'],
        required: true
    }
}, { timestamps: true });

// Ensure a user can only interact once per type per blog
interactionSchema.index({ user: 1, blog: 1, type: 1 }, { unique: true });

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;
