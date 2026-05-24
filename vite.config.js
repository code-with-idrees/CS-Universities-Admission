import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Models to try, in priority order (newest/best free-tier first).
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

// Custom Vite plugin that adds a /generate endpoint directly in the dev server.
function aiApiPlugin() {
  let geminiKey = '';

  return {
    name: 'ai-api-middleware',
    configResolved(config) {
      // loadEnv reads VITE_* vars; we also check process.env for GEMINI_API_KEY
      const env = loadEnv('development', config.root, '');
      geminiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
      if (geminiKey) {
        console.log('[ai-api] Gemini API key loaded ✓ (length:', geminiKey.length, ')');
      } else {
        console.warn('[ai-api] ⚠ No Gemini API key found! Set VITE_GEMINI_API_KEY in .env');
      }
    },
    configureServer(server) {
      server.middlewares.use('/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        // Read request body
        let body = '';
        for await (const chunk of req) body += chunk;

        let universityName = '';
        try {
          const parsed = JSON.parse(body);
          universityName = parsed.universityName || '';
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
          return;
        }

        if (!universityName) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing universityName' }));
          return;
        }

        if (!geminiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'No Gemini API key found. Set VITE_GEMINI_API_KEY in .env and restart.' }));
          return;
        }

        const promptText = `Provide the typical Graduate Computer Science admission requirements for ${universityName}.\n\nInclude:\n1. Degree Programs offered (e.g., MS in CS, PhD, Data Science)\n2. GRE Requirements (e.g., typically required, optional, specific scores)\n3. English Proficiency (TOEFL/IELTS minimums)\n4. GPA expectations\n\nFormat the response using simple HTML tags like <ul>, <li>, and <strong> so it can be safely injected into a React dangerouslySetInnerHTML div. Do not use markdown syntax. Keep it concise.`;

        const requestBody = JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        });

        // Try each model until one succeeds
        let lastError = '';
        for (const model of GEMINI_MODELS) {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          console.log(`[ai-api] Trying model: ${model} for "${universityName}"...`);

          try {
            const geminiRes = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            });

            const json = await geminiRes.json();

            if (geminiRes.ok) {
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
              console.log(`[ai-api] ✅ Success with ${model} (${text.length} chars)`);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ data: text, model }));
              return; // Done!
            }

            // Log and continue to next model
            const errMsg = json?.error?.message || `HTTP ${geminiRes.status}`;
            console.warn(`[ai-api] ❌ ${model} failed: ${errMsg}`);
            lastError = errMsg;

            // If it's a 404 (model not found), try next model immediately
            // If it's a 429 (rate limit), also try next model
            // For other errors (401 bad key, etc.), stop trying
            if (geminiRes.status !== 404 && geminiRes.status !== 429) {
              break;
            }
          } catch (err) {
            console.error(`[ai-api] ❌ ${model} fetch error:`, err.message);
            lastError = err.message;
          }
        }

        // All models failed
        console.error(`[ai-api] All models failed. Last error: ${lastError}`);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: lastError || 'All Gemini models failed. Check your API key and quota.' }));
      });

      server.middlewares.use('/recommend-profile', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        let body = '';
        for await (const chunk of req) body += chunk;

        let payload;
        try {
          payload = JSON.parse(body);
        } catch {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }

        const { text, candidateUniversities } = payload;
        if (!text || !candidateUniversities) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Missing text or candidateUniversities' }));
        }

        if (!geminiKey) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'No Gemini API key found.' }));
        }

        const promptText = `
You are an expert graduate admissions advisor. I will provide you with a candidate's resume/profile text, and a list of candidate universities along with their faculty members.
Your job is to analyze the candidate's interests and background, and recommend the best matching universities and specific professors from the provided list.

Provide separate recommendations for Masters programs and PhD programs.
For each recommendation, explain WHY this university and these specific professors are a good fit for the candidate's profile.

Resume/Profile:
${text.substring(0, 5000)} // Truncated to avoid huge payloads

Candidate Universities Data (JSON):
${JSON.stringify(candidateUniversities)}

Return your response EXCLUSIVELY as a JSON object matching this exact schema, with no markdown formatting or backticks around it:
{
  "masters": [
    { "university": "University Name", "professors": ["Prof A", "Prof B"], "reason": "Explain why..." }
  ],
  "phd": [
    { "university": "University Name", "professors": ["Prof A", "Prof B"], "reason": "Explain why..." }
  ]
}
`;

        const requestBody = JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        });

        let lastError = '';
        for (const model of GEMINI_MODELS) {
          try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody,
            });
            const json = await geminiRes.json();
            if (geminiRes.ok) {
              let aiText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
              aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
              res.setHeader('Content-Type', 'application/json');
              res.end(aiText);
              return;
            }
            lastError = json?.error?.message;
            if (geminiRes.status !== 404 && geminiRes.status !== 429) break;
          } catch (err) {
            lastError = err.message;
          }
        }
        res.statusCode = 500;
        res.end(JSON.stringify({ error: lastError || 'API failed' }));
      });

      // ----- /chat endpoint for conversational Gemini chatbot -----
      server.middlewares.use('/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        let body = '';
        for await (const chunk of req) body += chunk;

        let payload;
        try {
          payload = JSON.parse(body);
        } catch {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }

        const { message, fileContext, history } = payload;
        if (!message && !fileContext) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Missing message' }));
        }

        if (!geminiKey) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'No Gemini API key found. Set VITE_GEMINI_API_KEY in .env and restart.' }));
        }

        // Build conversation contents for Gemini
        const systemContext = `You are an expert CS graduate admissions advisor chatbot for the "CS Universities Admission Portal". You have knowledge about computer science universities worldwide, their faculty, research areas, admission requirements, and programs.

You help students with:
- Finding universities that match their research interests (AI, ML, Computer Vision, NLP, Robotics, Data Science, Security, Systems, Theory, HCI, Software Engineering, etc.)
- Recommending professors based on research areas
- Explaining admission requirements (GRE, TOEFL, GPA, etc.)
- Comparing programs across universities
- Analyzing uploaded resumes/CVs and suggesting matching universities and professors
- General grad school advice

Be helpful, specific, and encouraging. Format your responses with clear structure using markdown (headings, bullet points, bold text). Keep responses concise but informative.`;

        const contents = [];
        
        // Add system context as first user message
        contents.push({
          role: 'user',
          parts: [{ text: systemContext }],
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'I understand! I\'m your CS Graduate Admissions Advisor. I\'m ready to help you find the perfect university, professor, and program for your graduate studies. How can I help you today?' }],
        });

        // Add conversation history
        if (history && Array.isArray(history)) {
          for (const msg of history) {
            contents.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            });
          }
        }

        // Add current message with file context
        const currentMessage = fileContext
          ? `${message}\n\n${fileContext}`
          : message;

        contents.push({
          role: 'user',
          parts: [{ text: currentMessage }],
        });

        const requestBody = JSON.stringify({ contents });

        let lastError = '';
        for (const model of GEMINI_MODELS) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
              }
            );
            const json = await geminiRes.json();
            if (geminiRes.ok) {
              const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ response: aiText, model }));
              return;
            }
            lastError = json?.error?.message || `HTTP ${geminiRes.status}`;
            if (geminiRes.status !== 404 && geminiRes.status !== 429) break;
          } catch (err) {
            lastError = err.message;
          }
        }
        res.statusCode = 500;
        res.end(JSON.stringify({ error: lastError || 'All Gemini models failed' }));
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), aiApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
