import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post("/ask" , async (req ,res)=>{
  const { prompt } = req.body;

  if(!prompt){
    return res.status(400).json({error: "Prompt is requiered."})
  }

  try{
    const result = await ai.models.generateContent({
      model:"gemini-2.5-flash",
      contents: prompt,
    });

    const text = result.text;
    return res.json({response: text});
  } catch(error){
    console.error("❌ Gemini API Error:", error); // <- See what's wrong
    return res.status(500).json({ error: "Gemini API call failed." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at ${PORT}`)
})
