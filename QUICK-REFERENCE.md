# 📋 Raqim API - Quick Reference

## Essential Commands

### Worker Setup
```bash
cd raqim-api
npm install
wrangler login
```

### Set Secrets
```bash
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put OPENAI_OSS_MODEL      # gpt-4o-mini
wrangler secret put ALLOWED_ORIGIN        # * or https://yourdomain.com
```

### Development
```bash
# Start local Worker
npm run dev

# Test endpoint
curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"tool":"prompt_refiner","prompt":"Test","locale":"en"}'

# View logs
npm run tail
```

### Deployment
```bash
# Deploy to Cloudflare
npm run deploy

# Output: https://raqim-api.YOUR-SUBDOMAIN.workers.dev
```

### Frontend Configuration
```bash
cd ..
cp .env.example .env

# Edit .env:
# VITE_API_BASE_URL=https://raqim-api.YOUR-SUBDOMAIN.workers.dev

npm run dev
```

---

## API Request Format

```json
POST /api/ai/generate
{
  "tool": "prompt_refiner",
  "prompt": "Your input text",
  "system": "Optional system prompt",
  "temperature": 0.7,
  "maxOutputTokens": 2048,
  "locale": "ar",
  "images": ["data:image/jpeg;base64,..."]
}
```

---

## Tool → Provider Mapping

| Tool | Provider | Model |
|------|----------|-------|
| `image_to_prompt` | Gemini | gemini-2.0-flash-exp |
| `prompt_refiner` | OpenAI | gpt-4o-mini |
| `blog_to_thread` | Gemini | gemini-2.0-flash-exp |

Edit `src/router.ts` to customize.

---

## Troubleshooting

```bash
# Re-login to Cloudflare
wrangler login

# List secrets
wrangler secret list

# Delete and recreate secret
wrangler secret delete GEMINI_API_KEY
wrangler secret put GEMINI_API_KEY

# View live logs
wrangler tail

# Redeploy
npm run deploy
```

---

## Environment Variables

**Worker (Cloudflare Secrets):**
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_OSS_MODEL`
- `ALLOWED_ORIGIN`

**Worker (wrangler.toml):**
- `MAX_REQUESTS_PER_MINUTE` (default: 30)
- `MAX_PROMPT_LENGTH` (default: 20000)

**Frontend (.env):**
- `VITE_API_BASE_URL`

---

## Useful Links

- Worker Dashboard: https://dash.cloudflare.com
- Wrangler Docs: https://developers.cloudflare.com/workers/
- Gemini API: https://ai.google.dev/
- OpenAI API: https://platform.openai.com/

---

## Quick Tests

**Test Gemini (vision):**
```bash
curl -X POST $WORKER_URL/api/ai/generate \
  -d '{"tool":"image_to_text","prompt":"Describe this","images":["data:image/png;base64,iVBORw..."]}'
```

**Test OpenAI (prompt engineering):**
```bash
curl -X POST $WORKER_URL/api/ai/generate \
  -d '{"tool":"prompt_refiner","prompt":"Write a blog about AI"}'
```

**Test rate limiting:**
```bash
# Run 35 requests quickly - should get 429 after 30
for i in {1..35}; do
  curl -X POST $WORKER_URL/api/ai/generate \
    -d '{"tool":"prompt_refiner","prompt":"Test '$i'"}'
done
```

---

**Status**: All systems operational ✅
