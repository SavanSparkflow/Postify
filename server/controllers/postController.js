const Post = require("../models/Post");
const User = require("../models/User");
const { generatePost, translatePost } = require("../utils/aiService");
const { uploadImage } = require("../utils/cloudinary");
const axios = require("axios");

const createPost = async (req, res) => {
    const { idea, platform, tone, image } = req.body;

    if (!idea || !platform || !tone) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    try {
        const generatedContent = await generatePost(idea, platform, tone, image);

        // Upload to Cloudinary if image exists
        let imageUrl = image;
        if (image && image.startsWith("data:image")) {
            imageUrl = await uploadImage(image);
        }

 

        const post = await Post.create({
            userId: req.user.id,
            idea,
            platform,
            tone,
            generatedContent,
            image: imageUrl,
        });

        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalPosts = await Post.countDocuments({ userId: req.user.id });
        const posts = await Post.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.json({ success: true, message: "Post removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const translateUserPost = async (req, res) => {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
        return res.status(400).json({ success: false, message: "Please provide text and targetLanguage" });
    }
    try {
        const translatedContent = await translatePost(text, targetLanguage);
        res.status(200).json({ success: true, translatedContent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const generateImagePrompt = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ success: false, message: "Please provide text" });
    }
    try {

        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const promptText = `Create a visually stunning, high-detail prompt (max 20 words) for Stable Diffusion AI about this post: ${text}. Only output the prompt.`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(promptText);
        const imagePrompt = (await result.response.text()).trim();

        // New Hugging Face Generation (Professional & Reliable)
        // If user hasn't provided HF token, we fallback to Pollinations as a temporary measure
        let imageUrl;
        if (process.env.HUGGINGFACE_API_KEY) {
            console.log("Generating image with Hugging Face...");
            const hfResponse = await axios.post(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                { inputs: imagePrompt },
                {
                    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
                    responseType: 'arraybuffer'
                }
            );

            // Upload the generated binary data directly to Cloudinary
            imageUrl = await uploadImage(Buffer.from(hfResponse.data, 'binary'));
        } else {
            // Reliable Pollinations URL (Direct)
            const seed = Math.floor(Math.random() * 1000000);
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=512&height=512&nologo=true&seed=${seed}`;
            console.log("Using Pollinations (No HF Key):", pollinationsUrl);
            imageUrl = await uploadImage(pollinationsUrl);
        }

 

        res.status(200).json({ success: true, imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePost = async (req, res) => {
    const { image } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        let imageUrl = post.image;
        if (image && image.startsWith("data:image")) {
            imageUrl = await uploadImage(image);
        } else if (image) {
            imageUrl = image;
        }

        post.image = imageUrl;
        await post.save();
        res.json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createPost, getUserPosts, deletePost, translateUserPost, generateImagePrompt, getUserProfile, updatePost };
