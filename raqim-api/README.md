# Raqim API - Cloudflare Worker

Production-ready API gateway for Raqim AI platform. Routes requests to multiple AI providers (Gemini, OpenAI GPT-OSS) with security, rate limiting, and unified interface.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cloudflare account (free tier works)
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
cd raqim-api
npm install

# Install Cloudflare Workers types
npm install --save-dev @cloudflare/workers-types@latest wrangler@latest typescript@latest
```

### Configuration

Set secrets via Wrangler (do NOT add to `.env` or `wrangler.toml`):

```bash
wrangler secret put GEMINI_API_KEY
# Paste your Gemini API key

wrangler secret put OPENAI_API_KEY
# Paste your OpenAI API key

wrangler secret put OPENAI_OSS_MODEL
# Enter: gpt-4o-mini (or your preferred model)

wrangler secret put ALLOWED_ORIGIN
# Enter: https://your-frontend-domain.com (or * for dev)
```

### Development

```bash
npm run dev
# Worker runs on http://localhost:8787
```

Test locally:

```bash
curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "prompt_refiner",
    "prompt": "Write a blog post about AI",
    "locale": "en"
  }'
```

### Deploy

```bash
npm run deploy
# Outputs: https://raqim-api.YOUR-SUBDOMAIN.workers.dev
```

Copy the Worker URL and set it in your frontend `.env`:

```bash
VITE_API_BASE_URL=https://raqim-api.YOUR-SUBDOMAIN.workers.dev
```

## 📡 API Reference

### POST /api/ai/generate

**Request:**

```json
{
  "tool": "prompt_refiner",
  "prompt": "Your input text",
  "system": "Optional system instructions",
  "temperature": 0.7,
  "maxOutputTokens": 2048,
  "locale": "ar",
  "images": ["data:image/jpeg;base64,..."]
}
```

**Response:**

```json
{
  "text": "Generated output",
  "provider": "gemini",
  "model": "gemini-2.0-flash-exp",
  "latencyMs": 450,
  "usage": {
    "inputTokens": 120,
    "outputTokens": 350
  }
}
```

**Error Response:**

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT"
}
```

## 🛠️ Provider Routing

| Tool Type | Provider | Model |
|-----------|----------|-------|
| `image_to_prompt`, `image_to_text`, `two_images_to_prompt` | Gemini | gemini-2.0-flash-exp |
| `prompt_refiner`, `prompt_checker`, `advanced_prompt` | OpenAI | gpt-4o-mini (configurable) |
| All others | Gemini | gemini-2.0-flash-exp |

Edit `src/router.ts` to customize routing logic.

## 🔒 Security Features

- **Rate Limiting:** 30 requests/minute per IP (configurable in `wrangler.toml`)
- **Input Validation:** Max prompt length 20,000 chars
- **CORS:** Restricts origins to `ALLOWED_ORIGIN`
- **Secret Management:** API keys stored in Cloudflare Secrets (never in code)
- **Error Sanitization:** Stack traces hidden in production

## 📊 Monitoring

View real-time logs:

```bash
npm run tail
```

Check dashboard: https://dash.cloudflare.com → Workers & Pages → raqim-api

## 🐛 Troubleshooting

**"Missing secret GEMINI_API_KEY"**
- Run: `wrangler secret put GEMINI_API_KEY`

**CORS errors in browser**
- Verify `ALLOWED_ORIGIN` matches your frontend URL
- Check browser DevTools → Network → Response Headers

**Rate limit errors**
- Increase `MAX_REQUESTS_PER_MINUTE` in `wrangler.toml`
- Deploy: `npm run deploy`

**Slow responses**
- Check Worker logs: `npm run tail`
- Verify API key quotas on provider dashboards

## 📁 Project Structure

```
raqim-api/
├── src/
│   ├── index.ts           # Worker entry point
│   ├── types.ts           # TypeScript interfaces
│   ├── router.ts          # Tool → Provider routing
│   ├── middleware.ts      # Security & validation
│   └── providers/
│       ├── gemini.ts      # Gemini integration
│       └── openai.ts      # OpenAI integration
├── wrangler.toml          # Worker configuration
├── package.json
└── README.md
```

## 🔄 Updating

```bash
# Pull latest code
git pull

# Deploy changes
npm run deploy
```

## 📝 License

MIT - Raqim AI © 2024
