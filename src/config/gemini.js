import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log(response.text);
}

await main();