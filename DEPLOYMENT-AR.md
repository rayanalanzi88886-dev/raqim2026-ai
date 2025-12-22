# 🚀 دليل النشر السريع - Raqim API

## ✅ ما تم إنجازه

تم تحويل "رقيم" من تطبيق Client-only إلى معمارية Production-ready مع:

- ✓ Cloudflare Worker API Router (`raqim-api/`)
- ✓ Multi-provider: Gemini + OpenAI GPT-OSS 120B
- ✓ حماية مفاتيح API (Secrets فقط في Cloudflare)
- ✓ Rate Limiting (30 طلب/دقيقة لكل IP)
- ✓ CORS + Input Validation
- ✓ Frontend معدّل: استدعاء Worker بدلاً من Gemini مباشرة
- ✓ Logging: provider/model/latency/tokens

---

## 📦 الملفات الجديدة

```
raqim-api/                    ← مشروع Worker الجديد
├── src/
│   ├── index.ts             ← Entry point
│   ├── types.ts             ← TypeScript interfaces
│   ├── router.ts            ← توزيع الأدوات على Providers
│   ├── middleware.ts        ← أمان + Rate Limiting
│   └── providers/
│       ├── gemini.ts        ← Gemini REST API
│       └── openai.ts        ← OpenAI GPT-4o-mini
├── wrangler.toml            ← إعدادات Worker
├── package.json
└── README.md                ← توثيق كامل بالإنجليزية

Frontend (معدّل):
├── services/aiClient.ts     ← جديد: يستدعي Worker
├── App.tsx                  ← معدّل: generateAI بدلاً من processPrompt
└── .env.example             ← متغيرات البيئة
```

---

## 🛠️ خطوات التشغيل (5 دقائق)

### 1. تثبيت Dependencies

```bash
# داخل مجلد raqim-api
cd raqim-api
npm install
```

### 2. ضبط المفاتيح السرية

**مهم:** لا تضع المفاتيح في ملفات! استخدم Wrangler:

```bash
# تسجيل الدخول لـ Cloudflare (مرة واحدة)
wrangler login

# ضبط مفاتيح API
wrangler secret put GEMINI_API_KEY
# الصق مفتاح Gemini API

wrangler secret put OPENAI_API_KEY
# الصق مفتاح OpenAI API

wrangler secret put OPENAI_OSS_MODEL
# اكتب: gpt-4o-mini

wrangler secret put ALLOWED_ORIGIN
# اكتب: * (للتطوير) أو https://yourdomain.com (للإنتاج)
```

### 3. اختبار محلي

```bash
# تشغيل Worker محلياً
npm run dev

# في نافذة أخرى، اختبر:
curl -X POST http://localhost:8787/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"tool":"prompt_refiner","prompt":"اكتب مقال عن الذكاء الاصطناعي","locale":"ar"}'
```

إذا عمل → ستحصل على نص JSON فيه `"text": "..."`

### 4. نشر Worker

```bash
npm run deploy
```

سترى رابط مثل:
```
✨ Published raqim-api
   https://raqim-api.YOUR-SUBDOMAIN.workers.dev
```

**انسخ هذا الرابط!**

### 5. ضبط Frontend

ارجع لمجلد المشروع الرئيسي:

```bash
cd ..

# أنشئ ملف .env
cp .env.example .env
```

افتح `.env` وعدّل:

```bash
VITE_API_BASE_URL=https://raqim-api.YOUR-SUBDOMAIN.workers.dev
```

شغّل Frontend:

```bash
npm run dev
```

---

## 🔍 توزيع الأدوات على Providers

| الأداة | المزود | النموذج |
|--------|---------|----------|
| هندسة الأوامر (Prompt Refiner, Checker, Advanced) | OpenAI | gpt-4o-mini |
| الذكاء البصري (كل أدوات الصور) | Gemini | gemini-2.0-flash-exp |
| باقي الأدوات (Content, Social, etc.) | Gemini | gemini-2.0-flash-exp |

تعديل التوزيع: افتح `raqim-api/src/router.ts`

---

## 🔒 الأمان

- ✅ **لا توجد مفاتيح في Frontend** - كلها محمية في Worker
- ✅ **Rate Limiting** - 30 طلب/دقيقة لكل IP (قابل للتعديل في `wrangler.toml`)
- ✅ **Input Validation** - حد أقصى 20,000 حرف للـ Prompt
- ✅ **CORS** - مقيد حسب `ALLOWED_ORIGIN`

---

## 📊 مراقبة

عرض Logs مباشرة:

```bash
cd raqim-api
npm run tail
```

أو من Dashboard:
https://dash.cloudflare.com → Workers & Pages → raqim-api

---

## 🐛 حل المشاكل

### Worker لا يستجيب
```bash
# تأكد من المفاتيح
wrangler secret list

# إعادة نشر
npm run deploy
```

### CORS Errors في المتصفح
- تحقق من `ALLOWED_ORIGIN` يطابق رابط Frontend
- للتطوير، اضبطه على `*`

### Frontend يعرض أخطاء
- تأكد من `VITE_API_BASE_URL` في `.env` صحيح
- أعد تشغيل `npm run dev` بعد تعديل `.env`

### Rate Limit
- زد `MAX_REQUESTS_PER_MINUTE` في `wrangler.toml`
- أعد النشر: `npm run deploy`

---

## 📝 الخطوات التالية (اختياري)

1. **Custom Domain**: اربط دومينك الخاص في Cloudflare Dashboard
2. **Analytics**: فعّل Cloudflare Analytics لمراقبة الاستخدام
3. **Caching**: أضف Cloudflare KV للـ caching إن لزم
4. **Jina Reader**: انقل `fetchUrlContent` إلى Worker لحماية `JINA_API_KEY`

---

## 💡 ملاحظات مهمة

- **Worker مجاني** حتى 100,000 طلب/يوم
- **لا حاجة لسيرفر** - كل شيء Serverless
- **التحديثات**: `npm run deploy` فقط بعد تعديل الكود
- **الأمان**: لا تنشر مفاتيح API في Git أبداً

---

## 📞 الدعم

- Worker Docs: https://developers.cloudflare.com/workers/
- Gemini API: https://ai.google.dev/
- OpenAI API: https://platform.openai.com/docs

---

**تم التحويل بنجاح! 🎉**

الآن تطبيقك Production-ready مع حماية كاملة للمفاتيح وتوزيع ذكي بين Providers.
