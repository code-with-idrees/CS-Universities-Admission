# CS Universities Admission Portal

A modern, **premium‑styled** web application inspired by [CSRankings.org](https://csrankings.org) that lists *all* universities from the CSRankings dataset and provides a clean UI to explore **graduate admission requirements** for computing programmes (CS, AI, Data‑Science, etc.).

## Features
- ✅ Full list of 741 universities (including region and country information).
- 🎨 Dark‑mode UI with glass‑morphism, smooth hover animations and a responsive grid.
- 🔎 Filter by **region** and **country** via a sleek filter bar.
- 💬 Integrated **Gemini chatbot UI** (ready to plug your Gemini API key) for interactive admission‑related queries.
- ⚡ Built with **React 18**, **Vite**, and modern tooling (ESM, fast refresh).
- 📦 Ready for deployment on Vercel, Netlify, GitHub Pages, etc.

## Demo
> (After running `npm run dev` you can open http://localhost:3000 to see the portal.)

## Getting Started
```bash
# 1️⃣ Clone the repository
git clone https://github.com/your‑username/cs‑universities‑admission.git
cd cs‑universities‑admission

# 2️⃣ Install dependencies (npm or pnpm works)
npm install   # or `pnpm i`

# 3️⃣ Create a .env file (copy from .env.example)
cp .env.example .env
#   - Add your Gemini API key: VITE_GEMINI_API_KEY=your_key_here

# 4️⃣ Start the development server
npm run dev   # Vite will open http://localhost:3000
```

## Project Structure
```
cs‑universities‑admission/
├─ public/
│   └─ data/institutions.csv          # CSRankings raw CSV (served statically)
├─ src/
│   ├─ components/
│   │   ├─ FilterBar.jsx               # Region / country selectors
│   │   ├─ UniversityList.jsx          # Card‑grid view of universities
│   │   └─ ChatBot.jsx                 # Gemini chatbot UI (plug‑and‑play)
│   ├─ App.jsx                         # Main app – data loading & filters
│   ├─ index.css                       # Premium dark theme & glassmorphism
│   └─ main.jsx                        # Vite entry point
├─ .env.example                       # Environment variable template
├─ package.json                        # Scripts, deps, etc.
├─ vite.config.js                     # Vite + React plugin
└─ README.md                          # You are reading it!
```

## Gemini Chatbot Integration
The `ChatBot` component sends user messages to the Gemini API using the key defined in `.env`.
```js
const response = await fetch(`${process.env.VITE_GEMINI_API_KEY ?
  `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`
  : ''}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: userMessage }] }] })
});
```
If you do not yet have a key, the UI will show a friendly placeholder prompting you to add one.

## Deploying
Because the app is a static build, you can simply run:
```bash
npm run build
# Then push the `dist/` folder to your favourite static host.
```

## License
MIT – feel free to fork, improve and share!
