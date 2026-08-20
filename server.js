// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors()); // Allow your Netlify site to call this
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // You set this in Render > Environment
});

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({error: "Prompt is required"});

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert web developer. Return ONLY a complete single-file HTML document with inline Tailwind CSS via CDN. No explanations, no markdown fences. Make it dark theme, modern, responsive, with glassmorphism and 3D effects to match WALKER WEBS brand."
        },
        { role: "user", content: `Build me this website: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let html = completion.choices[0].message.content;
    html = html.replace(/```html/g, "").replace(/```/g, "").trim(); // remove markdown
    res.json({ html });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Render AI running on ${PORT}`));