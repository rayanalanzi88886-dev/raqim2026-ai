<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Raqim AI - رقيم: مولد أوامر الذكاء الاصطناعي

**Production-ready AI Platform** with Multi-Provider Architecture (Gemini + OpenAI GPT-OSS)

> ⚠️ **IMPORTANT**: This project now uses a **Cloudflare Worker** API gateway. API keys are secured server-side.

## 🎯 What's New (Production Architecture)

- ✅ **Cloudflare Worker API Router** (`raqim-api/`)
- ✅ **Multi-Provider Support**: Gemini + OpenAI GPT-OSS 120B
- ✅ **API Key Protection**: All secrets in Cloudflare (never exposed to browsers)
- ✅ **Rate Limiting**: 30 requests/minute per IP
- ✅ **CORS + Security**: Production-grade validation
- ✅ **Zero Server Costs**: Fully serverless (100K free requests/day)

## 🚀 Quick Start (New Setup)

### 1. Clone & Install Frontend
```bash
git clone <your-repo>
cd raqim-ai-(رقيم)---مولد-أوامر-الذكاء-الاصطناعي
npm install
```

### 2. Deploy Worker API (Required)
```bash
cd raqim-api
npm install
wrangler login

# Set secrets (interactive)
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put OPENAI_OSS_MODEL      # Enter: gpt-4o-mini
wrangler secret put ALLOWED_ORIGIN        # Enter: * (for dev)

# Deploy
npm run deploy
# Copy the Worker URL: https://raqim-api.YOUR-SUBDOMAIN.workers.dev
```

### 3. Configure Frontend
```bash
cd ..
cp .env.example .env
# Edit .env and set:
# VITE_API_BASE_URL=https://raqim-api.YOUR-SUBDOMAIN.workers.dev

npm run dev
```

**Open**: http://localhost:5173

---

## 🌐 Deploy with GitHub + Cloudflare Pages (Production)

### A) Push code to GitHub
1. Initialize and push your local project to a new GitHub repo.
      ```bash
      git init
      git add .
      git commit -m "Initial commit: Raqim AI frontend"
      git branch -M main
      git remote add origin https://github.com/<your-username>/raqim-ai.git
      git push -u origin main
      ```
2. Ensure your `package.json` has a build script (`npm run build`) and output directory `dist`.

### B) Connect GitHub to Cloudflare Pages
1. Cloudflare Dashboard → Pages → Create a project → Connect GitHub.
2. Select the repo (`raqim-ai`) and configure:
      - Build command: `npm install && npm run build`
      - Output directory: `dist`
3. After first deploy, in Pages → Settings → Environment variables:
      - Add `VITE_API_BASE_URL = https://api.raqim.me`.

### C) Custom Domains
1. Worker API: already mapped to `api.raqim.me` under Workers → Settings → Domains & Routes.
2. Frontend: Pages → Custom Domains → add `app.raqim.me` (or `raqim.me` if you want the UI on the root).
3. DNS/SSL will auto-provision (allow a few minutes).

### D) Verify
- Open `https://app.raqim.me` and trigger a tool (e.g., `prompt_refiner`).
- Network calls should hit `https://api.raqim.me/api/ai/generate` and return 200.
- If you see CORS errors, confirm `ALLOWED_ORIGIN` in the Worker includes `https://app.raqim.me,https://raqim.me`.

## 📚 Documentation

- **[DEPLOYMENT-AR.md](DEPLOYMENT-AR.md)** - دليل النشر بالعربية (Arabic deployment guide)
- **[raqim-api/README.md](raqim-api/README.md)** - Full Worker API documentation
- **[SUMMARY.md](SUMMARY.md)** - Implementation summary
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Command cheat sheet

---

## 🏗️ Architecture

```
Frontend (Vite/React)
      ↓
Cloudflare Worker API Router
      ↓
  ┌────────┴────────┐
Gemini API      OpenAI API
(Vision, Content)  (Prompt Engineering)
```

**No direct API calls from browser** - all routed through Worker for security.

---

## 🔐 Security Features

- API keys stored in Cloudflare Secrets (encrypted)
- Rate limiting (30 req/min per IP)
- Input validation (max 20K chars)
- CORS protection
- Error sanitization (no stack traces)

---

## 🛠️ Development

### Frontend Only (Worker must be deployed first)
```bash
npm run dev
```

### Worker + Frontend
```bash
# Terminal 1: Worker
cd raqim-api
npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 📦 Legacy Setup (No Longer Recommended)

<details>
<summary>Click to view old client-side setup (NOT secure for production)</summary>

1. Install dependencies: `npm install`
2. Set `GEMINI_API_KEY` in `.env.local`
3. Run: `npm run dev`

⚠️ **This exposes API keys in the browser. Use Worker setup above instead.**

</details>

---

## 🔗 Links

- **AI Studio**: https://ai.studio/apps/drive/1uNH4MU-VaQKb4EKDhd4Gm2v8emgxJ_Ki
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Gemini API**: https://ai.google.dev/
- **OpenAI API**: https://platform.openai.com/

---

## 📝 License

MIT © Raqim AI

