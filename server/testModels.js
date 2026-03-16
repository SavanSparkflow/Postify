require("dotenv").config();
const fs = require("fs");
async function run() {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    const valid = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name);
    fs.writeFileSync("models.json", JSON.stringify(valid, null, 2));
}
run();
