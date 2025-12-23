import User from "../models/user.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role createdAt avatar').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'author', 'editor', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
