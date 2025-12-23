import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true, // One document per day
        index: true
    },
    views: { type: Number, default: 0 },
    mobileViews: { type: Number, default: 0 },
    desktopViews: { type: Number, default: 0 },
    tabletViews: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
}, { timestamps: true });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
