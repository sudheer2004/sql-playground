const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const generateHint = async (question) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a SQL tutor. Give a short helpful hint for this SQL problem without revealing the answer: ${question}`,
  });
  return response.text;
};

module.exports = { generateHint };