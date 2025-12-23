import Analytics from "../models/analytics.js";

// Helper to get start of today (UTC or local based on req, standardizing on UTC for simplicity)
const getTodayDate = () => {
    const now = new Date();
    // Normalize to YYYY-MM-DD
    return new Date(now.toISOString().split('T')[0]);
};

export const trackVisit = async (userAgent) => {
    const today = getTodayDate();

    let updateFields = { views: 1 };

    // Simple device detection
    const ua = userAgent ? userAgent.toLowerCase() : '';
    if (/mobile|android|iphone|ipod/.test(ua)) {
        updateFields.mobileViews = 1;
    } else if (/ipad|tablet/.test(ua)) {
        updateFields.tabletViews = 1;
    } else {
        updateFields.desktopViews = 1;
    }

    try {
        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: updateFields },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error("Error tracking visit:", error);
    }
};

export const trackInteraction = async (type) => {
    // type can be 'likes' or 'comments'
    const today = getTodayDate();
    try {
        const update = {};
        if (type === 'like') update.likes = 1;
        if (type === 'comment') update.comments = 1;

        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: update },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error(`Error tracking ${type}:`, error);
    }
};

export const getAnalyticsData = async (days = 7) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const data = await Analytics.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Fill in missing days with 0 if needed (optional, but good for charts)
        // For now, returning raw data
        return data;
    } catch (error) {
        throw error;
    }
};
