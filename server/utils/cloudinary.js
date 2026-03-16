const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const uploadImage = async (imagePath) => {
    // Refresh config to ensure .env changes are picked up
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    try {
        // Handle Buffer directly (e.g., from Hugging Face)
        if (Buffer.isBuffer(imagePath)) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "PostifyAI", resource_type: "auto" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                uploadStream.end(imagePath);
            });
        }

        // If it's a remote URL (like Pollinations), fetch it first to avoid Cloudinary timeouts
        if (typeof imagePath === "string" && imagePath.startsWith("http")) {
            console.log("Fetching image from URL locally before Cloudinary upload...");

            let response;
            let retries = 2;
            let delay = 3000;

            while (retries >= 0) {
                try {
                    response = await axios.get(imagePath, {
                        responseType: 'arraybuffer',
                        timeout: 90000, // 90 seconds - AI generation can be slow
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                        }
                    });
                    break;
                } catch (error) {
                    if (retries === 0) {
                        console.error("All fetch attempts failed. Falling back to original URL.");
                        throw error;
                    }
                    console.log(`Fetch failed (${error.message}). Retrying in ${delay / 1000}s... (${retries} left)`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries--;
                    delay += 2000;
                }
            }

            const buffer = Buffer.from(response.data, 'binary');

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "PostifyAI", resource_type: "auto" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                uploadStream.end(buffer);
            });
        }

        // For local paths or base64 strings
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: "PostifyAI",
            resource_type: "auto",
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary/Fetch Error Details:", error);
        throw new Error(`Upload Failed: ${error.message}`);
    }
};

module.exports = { uploadImage };
