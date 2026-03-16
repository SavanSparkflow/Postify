const express = require("express");
const { createPost, getUserPosts, deletePost, translateUserPost, generateImagePrompt, getUserProfile, updatePost } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPost);
router.post("/translate", protect, translateUserPost);
router.post("/generate-image-prompt", protect, generateImagePrompt);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, getUserPosts);
router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
