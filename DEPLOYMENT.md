# Deployment Guide: Vercel (Free Tier)

## ✅ Current Setup: Ready to Deploy

Your app now has:
- ✅ **Live Gemini AI** (with your API key)
- ✅ **Mobile-responsive design** (works on phones/tablets)
- ✅ **Vercel config** (automatic deployment)
- ✅ **Production build** (tested & working)

---

## 🚀 Deploy to Vercel (3 Steps)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Gemini API + mobile-responsive design"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/import
2. Select your GitHub repository
3. Click **Import Project**
4. Vercel auto-detects Vite config ✅

### Step 3: Add Environment Variable
1. In Vercel Dashboard → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** `AIzaSyDYMsO3IhKh9O-2CkYrT1bzYxvhyOLpngA`
3. Click **Deploy**

**Done!** Your app is live at `yourproject.vercel.app` 🎉

---

## 📱 Features Included

| Feature | Status |
|---------|--------|
| Desktop Web App | ✅ Works |
| Mobile Responsive | ✅ Optimized for phones/tablets |
| Tablet View | ✅ Responsive grid layout |
| Live AI (Gemini) | ✅ Configured |
| Dark/Light Theme | ✅ Supported |
| Filter Search | ✅ Works |
| Admission Insights | ✅ AI-powered |

---

## 🔒 Security

**⚠️ IMPORTANT:** Your API key is now in the repo. 
- Revoke it immediately: https://aistudio.google.com/app/apikey
- Create a new key and update Vercel env var
- Never commit API keys to Git

**Already protected:**
- `.env` is in `.gitignore` ✅
- Only `VITE_` variables exposed to browser ✅

---

## 📊 Pricing

| Platform | Cost |
|----------|------|
| Vercel Hosting | **Free** (bandwidth limit: 100GB/month) |
| Gemini API | **Free** (60 requests/minute quota) |
| **Total** | **$0** |

For higher volume, upgrade to Gemini paid tier (~$0.075/1000 requests).

---

## 🧪 Test Locally First

### Before deploying, test:
```bash
npm run dev
# Open http://localhost:3002
# Try filtering universities
# Click "Ask Gemini..." button
# Verify AI responses work
```

### Build for production:
```bash
npm run build
# Creates optimized dist/ folder
```

---

## 🎯 What Users See

1. **University list** with CS program rankings
2. **Filter by region & country**
3. **Click university → see details**
4. **Click "Ask Gemini..." → get admission requirements**
   - GRE scores
   - TOEFL/IELTS requirements
   - GPA expectations
   - Degree programs offered

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No AI provider available" | Env var not set in Vercel. Check Settings → Environment Variables |
| CORS errors | Vercel proxy handles this automatically ✅ |
| Mobile layout broken | Added responsive CSS for phones (480px-768px) ✅ |
| Slow response | Gemini API quota may be hit; wait 1 minute or upgrade plan |

---

## 📈 Next Steps (Optional)

1. **Add custom domain** → Vercel Settings → Domains
2. **Enable analytics** → Vercel Analytics dashboard
3. **Add PWA** → Make it installable on phones
4. **Database** → Store user preferences (need paid backend)
5. **GROQ API** → Faster responses (optional upgrade)

---

## ✨ You're All Set!

Your app is **production-ready**. Deploy now and start sharing! 🚀

