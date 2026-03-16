const { GoogleGenerativeAI } = require("@google/generative-ai");

const generatePost = async (idea, platform, tone, imageBase64 = null) => {
    try {
        let templateRules = "";

        if (platform === "LinkedIn") {
            templateRules = `
Format as a professional LinkedIn post.
Structure:
- Strong hook line (under 120 characters)
- Introduce a clear problem or insight
- Share a brief story or experience
- Provide actionable lessons or takeaways (use bullet points)
- Call to Action (CTA) encouraging comments
- Exactly 5 relevant hashtags at the bottom`;
        } else if (platform === "Twitter") {
            templateRules = `
Format as an engaging Twitter (X) thread.
Structure:
- Tweet 1: A viral hook that makes people stop scrolling (include a 🧵 emoji)
- Tweet 2-4: The core value, breaking down the idea logically. Use numbered tweets (e.g., 2/5, 3/5). Keep sentences short and punchy.
- Final Tweet: A strong conclusion and CTA to follow for more. 
- Do not use more than 3 hashtags total across the entire thread.`;
        } else if (platform === "Instagram") {
            templateRules = `
Format for an Instagram caption.
Structure:
- An intriguing, short hook in the very first sentence
- Use plenty of relevant emojis to break up text
- Keep heavy spacing/line breaks between paragraphs for readability
- Ask an engaging question for the CTA
- Exactly 10 highly searchable hashtags spaced at the very bottom`;
        } else if (platform === "Blog") {
            templateRules = `
Format as an SEO-optimized blog post introduction.
Structure:
- An attention-grabbing H1 Title
- A compelling opening hook
- The core problem the reader is facing
- A brief thesis statement on how you'll solve it
- Formatting with markdown headers (H2, H3)`;
        } else {
            templateRules = `
Include:
- Catchy hook
- Detailed body
- Bullet points if needed
- Call to action
- Relevant hashtags`;
        }

        const prompt = `You are an expert social media copywriter. Expand this idea ${imageBase64 ? "and the provided image" : ""} into a highly engaging ${platform} post in a ${tone} tone. 
        
${templateRules}

Idea to expand: "${idea}"`;

        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Use the Gemini 2.5 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const parts = [prompt];

        if (imageBase64) {
            const match = imageBase64.match(/^data:(image\/\w+);base64,(.*)$/);
            if (match) {
                const mimeType = match[1];
                const data = match[2];
                parts.push({ inlineData: { data, mimeType } });
            }
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        throw new Error("Failed to generate AI content via Gemini");
    }
};

const translatePost = async (text, targetLanguage) => {
    try {
        const prompt = `Translate the following social media post into ${targetLanguage}. Maintain the original tone, formatting, line breaks, and emojis. Do not add any extra commentary or introductory text.

Text to translate:
${text}`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Translation Error:", error.message);
        throw new Error("Failed to translate AI content via Gemini");
    }
};

module.exports = { generatePost, translatePost };
