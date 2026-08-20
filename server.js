// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // put key in .env file
});

// This is what WALKER WEBS will call
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5", // or gpt-4o
      messages: [
        {
          role: "system",
          content: `You are WALKER WEBS AI. Generate a complete single-file HTML website with TailwindCSS.
          Requirements:
          - Return ONLY raw HTML code. No explanations, no markdown.
          - Use Tailwind via CDN
          - Make it modern, dark theme, responsive
          - User prompt: ${prompt}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const html = completion.choices[0].message.content;
    res.json({ html });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate" });
  }
});

app.listen(3001, () => console.log("WALKER WEBS Backend running on http://localhost:3001"));