const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        idea: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            required: true,
        },
        tone: {
            type: String,
            required: true,
        },
        generatedContent: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Store base64 or URL
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
