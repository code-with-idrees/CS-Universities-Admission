#!/usr/bin/env node
/* CommonJS proxy for GROQ / Gemini. Run with:
   GEMINI_API_KEY=... or GROQ_API_KEY=... GROQ_ENDPOINT=... node server/proxy.cjs
*/
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = process.env.GROQ_ENDPOINT;

if (!GEMINI_API_KEY && !GROQ_API_KEY) {
  console.warn('Warning: No API key provided. Set GEMINI_API_KEY or GROQ_API_KEY (and GROQ_ENDPOINT) to enable proxying.');
}

app.post('/generate', async (req, res) => {
  try {
    const { universityName } = req.body || {};
    if (!universityName) return res.status(400).json({ error: 'Missing universityName in request body' });

    const promptText = `Provide the typical Graduate Computer Science admission requirements for ${universityName}. Include degree programs, GRE, English proficiency, and GPA expectations. Use simple HTML tags.`;

    // Only Groq is supported now
    const groqKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!groqKey) {
       return res.status(500).json({ error: "Missing Groq API Key on proxy server." });
    }

    const groqBody = { 
      model: "llama-3.1-8b-instant", 
      messages: [{ role: "user", content: promptText }] 
    };

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + groqKey 
      },
      body: JSON.stringify(groqBody)
    });
    
    const j = await r.json();
    if (!r.ok) {
      return res.status(500).json({ error: j?.error?.message || JSON.stringify(j) });
    }
    
    const text = j.choices?.[0]?.message?.content || JSON.stringify(j);
    return res.json({ data: text });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

app.listen(PORT, () => console.log(`API proxy running on http://localhost:${PORT} (POST /generate)`));
