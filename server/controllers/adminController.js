const User = require("../models/User");
const Post = require("../models/Post");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();

        // In a real scenario, you might have an API usage model too.
        // Simplifying here by using the post count as AI API usage metrics.

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalPostsGenerated: totalPosts,
                apiUsageCount: totalPosts,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAdminStats };
