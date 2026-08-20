// server.js - WALKER WEBS with GROQ
import express from "express";
import cors from "cors";
import Groq from "groq-sdk"; // <-- CHANGED
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

const PORT = process.env.PORT || 3001;

const PUBLISH_FOLDER = './published';
if (!fs.existsSync(PUBLISH_FOLDER)) fs.mkdirSync(PUBLISH_FOLDER);

// CHANGED: Use Groq instead of OpenAI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // CHANGED: Groq API call
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // Free + best model
      messages: [{ 
        role: "user", 
        content: `Generate a complete single-file HTML website with TailwindCSS CDN. Make it beautiful, responsive, and modern. Return ONLY raw HTML code, no explanation. Prompt: ${prompt}` 
      }],
      temperature: 0.7,
      max_tokens: 4000
    });
    
    res.json({ html: completion.choices[0].message.content });
  } catch (error) { 
    console.log(error);
    res.status(500).json({ error: error.message }); 
  }
});

app.post("/api/publish", (req, res) => {
  const { html } = req.body;
  const id = nanoid(8);
  const filename = `${id}.html`;
  fs.writeFileSync(path.join(PUBLISH_FOLDER, filename), html);
  res.json({ url: `/site/${filename}` });
});

app.use('/site', express.static(PUBLISH_FOLDER));

app.listen(PORT, () => console.log(`WALKER WEBS Backend running on port ${PORT}`));