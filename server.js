const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows Netlify to call this backend
app.use(express.json());

// Init Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: "WALKER WEBS Backend is live 🔥" });
});

// Main AI Generation Route
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Generating for:", prompt);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // <-- UPDATED MODEL
      messages: [{ 
        role: "user", 
        content: `Generate a complete single-file HTML website with TailwindCSS CDN. Make it beautiful, responsive, and modern. Include real content based on the prompt. Return ONLY raw HTML code starting with <!DOCTYPE html>, no explanation, no markdown backticks. Prompt: ${prompt}` 
      }],
      temperature: 0.7,
      max_tokens: 4000
    });

    const htmlCode = completion.choices[0].message.content;
    res.json({ html: htmlCode });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Publish route - placeholder for now
app.post('/api/publish', (req, res) => {
  res.json({ message: "Publish coming next", url: "#" });
});

app.listen(PORT, () => {
  console.log(`WALKER WEBS Backend running on port ${PORT}`);
});