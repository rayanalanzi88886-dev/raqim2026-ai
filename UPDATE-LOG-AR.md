# سجل التحديثات - Raqim AI Worker

📅 **آخر تحديث:** 25 ديسمبر 2025

---

## 🔄 التحديثات الرئيسية

### 1️⃣ التحويل الكامل إلى OpenAI فقط (بدلاً من Gemini + OpenAI)

**السبب:**
- مفتاح Gemini API تم الإبلاغ عنه كمسرب (leaked) وأصبح محظوراً من Google
- خطأ: `"Your API key was reported as leaked. Please use another API key"`

**التغييرات في الكود:**

#### ✅ ملف: `WORKER-COMPLETE-CODE.ts`

**حذف:**
- واجهة `GEMINI_API_KEY` من `interface Env`
- دالة `callGemini()` بالكامل (~60 سطر)
- المصفوفات `VISION_TOOLS` و `OPENAI_TOOLS` من منطق التوجيه

**تعديل:**
- `interface AIResponse`: غيّر `provider: 'gemini' | 'openai_oss'` → `provider: 'openai_oss'`
- `routeToProvider()`: الآن ترجع `'openai_oss'` دائماً لجميع الأدوات
- `getProviderModel()`: ترجع `gpt-4o-mini` فقط
- منطق التوليد: حذف `if (provider === 'gemini')` واستخدام `callOpenAI()` مباشرة

**النتيجة:**
- ✅ جميع الأدوات (12 أداة) تعمل الآن على OpenAI GPT-4o-mini
- ✅ لا توجد أي إشارة لـ Gemini في الكود

---

#### ✅ ملف: `services/aiClient.ts`

**تعديل:**
- `AIClientResponse` interface: غيّر `provider: 'gemini' | 'openai_oss'` → `provider: 'openai_oss'`

---

#### ❌ ملفات محذوفة:

- `test-gemini-key.js` - ملف اختبار Gemini API
- `raqim-api/` - مجلد Worker القديم بالكامل (15 ملف)
  - `.env.example`
  - `package.json`, `tsconfig.json`
  - `src/index.ts`, `src/providers/gemini.ts`
  - جميع الملفات المرتبطة

---

### 2️⃣ إضافة دعم الصور مع OpenAI Vision (gpt-4o-mini)

**التاريخ:** 25 ديسمبر 2025

**السبب:**
- تفعيل الأدوات البصرية: Image to Text, Image to Prompt, Merge Images
- استخدام قدرات Vision في gpt-4o-mini

**التغييرات في `callOpenAI()`:**

```typescript
// قبل التحديث:
messages.push({ role: 'user', content: request.prompt });

// بعد التحديث:
if (request.images && Array.isArray(request.images) && request.images.length > 0) {
  const content: any[] = [{ type: 'text', text: request.prompt }];
  for (const img of request.images) {
    content.push({
      type: 'image_url',
      image_url: { url: img }
    });
  }
  messages.push({ role: 'user', content });
} else {
  messages.push({ role: 'user', content: request.prompt });
}
```

**الوظائف المتأثرة:**
- ✅ `image_to_text` - استخراج النصوص من الصور (OCR)
- ✅ `image_to_prompt` - توليد برومبت من صورة
- ✅ `two_images_to_prompt` - دمج صورتين في برومبت واحد

**ملاحظة:**
- الصور تُرسل كـ Base64 data URLs أو HTTPS URLs
- الأدوات النصية تستمر بالعمل دون تأثير (لا صور = نص فقط)

---

### 3️⃣ ملفات توثيقية جديدة

#### ✅ `OPENAI-ONLY-UPDATE.md`
- شرح التحديثات بالتفصيل
- خطوات التحديث في Cloudflare
- قائمة الأدوات المتأثرة

#### ✅ `CLOUDFLARE-UPDATE-STEPS.txt`
- دليل خطوة بخطوة لتحديث Worker
- تعليمات نسخ الكود
- إعدادات المتغيرات
- اختبار الـ endpoint

---

## ⚙️ الإعدادات المطلوبة في Cloudflare Worker

### 🔐 Environment Variables (Settings → Variables)

| المتغير | القيمة | الحالة |
|---------|--------|--------|
| `OPENAI_API_KEY` | `sk-proj-...` | ✅ **مطلوب** |
| `OPENAI_OSS_MODEL` | `gpt-4o-mini` | ✅ موصى به |
| `ALLOWED_ORIGIN` | `https://raqim2026-ai.pages.dev, https://app.raqim.me` | ⚠️ **يُنصح بتقييده** |
| `ENVIRONMENT` | `production` | اختياري |
| `MAX_REQUESTS_PER_MINUTE` | `30` | افتراضي |
| `MAX_PROMPT_LENGTH` | `20000` | افتراضي |
| ~~`GEMINI_API_KEY`~~ | - | ❌ **احذفه** |

---

## 🚀 الخطوات المتبقية (يدوياً في Cloudflare)

### ✅ ما تم إنجازه:
- [x] تحديث `WORKER-COMPLETE-CODE.ts` محلياً
- [x] إضافة دعم الصور (Vision)
- [x] دفع التغييرات إلى GitHub
- [x] إنشاء ملفات التوثيق

### ⏳ ما يحتاج تنفيذ في Cloudflare:

#### 1. تحديث كود Worker:
```bash
1. افتح: https://dash.cloudflare.com
2. Workers & Pages → raqim-api
3. Edit Code
4. انسخ محتوى WORKER-COMPLETE-CODE.ts بالكامل
5. الصقه في المحرر (استبدل الكود القديم)
6. Save and Deploy
```

#### 2. تحديث المتغيرات:
```bash
Settings → Variables → Environment Variables
```
- **احذف:** `GEMINI_API_KEY`
- **أضف/حدث:**
  - `OPENAI_API_KEY` = مفتاحك الصحيح
  - `OPENAI_OSS_MODEL` = `gpt-4o-mini`
  
#### 3. تقييد CORS (أمان):
- **غيّر** `ALLOWED_ORIGIN` من `*` إلى:
  ```
  https://raqim2026-ai.pages.dev, https://app.raqim.me
  ```

#### 4. الاختبار:
من تبويب HTTP في Worker:
- Method: `POST`
- Path: `/api/ai/generate`
- Headers: `Content-Type: application/json`
- Body (نصي):
  ```json
  {
    "tool": "prompt_refiner",
    "prompt": "اكتب تغريدة جذابة عن الذكاء الاصطناعي",
    "system": "أنت كاتب محتوى محترف",
    "temperature": 0.4,
    "maxOutputTokens": 400,
    "locale": "ar"
  }
  ```
- Body (صور - لاحقاً):
  ```json
  {
    "tool": "image_to_text",
    "prompt": "استخرج كل النصوص من الصورة",
    "temperature": 0.2,
    "maxOutputTokens": 800,
    "images": ["data:image/png;base64,iVBOR..."]
  }
  ```

---

## 📊 ملخص التغييرات الفنية

| الجانب | قبل | بعد |
|--------|-----|-----|
| **مزودو AI** | Gemini + OpenAI | OpenAI فقط |
| **الموديلات** | gemini-2.0-flash-exp + gpt-4o-mini | gpt-4o-mini فقط |
| **دعم الصور** | Gemini فقط | OpenAI Vision (gpt-4o-mini) |
| **أدوات نصية** | 7 أدوات | 9 أدوات (كلها OpenAI) |
| **أدوات بصرية** | 3 أدوات (Gemini) | 3 أدوات (OpenAI) |
| **سطور الكود** | ~362 سطر | ~286 سطر |
| **التبعيات** | 2 API Keys | 1 API Key |
| **التكلفة** | متغيرة | أقل وأكثر تحكماً |

---

## 🛠️ الأدوات المدعومة حالياً (12 أداة)

### أدوات هندسة الأوامر (Prompt Engineering):
1. ✅ `prompt_refiner` - توليد الأوامر
2. ✅ `prompt_checker` - فحص جودة الأوامر
3. ✅ `advanced_prompt` - أوامر متقدمة

### أدوات المحتوى والتواصل:
4. ✅ `blog_to_thread` - تحويل مقال إلى ثريد
5. ✅ `rewrite` - إعادة صياغة وأنسنة
6. ✅ `text_detector` - كاشف النصوص (AI vs Human)
7. ✅ `product_desc` - وصف المنتجات

### أدوات بصرية (Visual Tools):
8. ✅ `image_prompt` - برومبتات الصور (Midjourney/DALL-E)
9. ✅ `video_prompt` - برومبتات الفيديو (Sora/VEO)
10. ✅ `image_to_text` - استخراج نصوص من صور (OCR)
11. ✅ `image_to_prompt` - توليد برومبت من صورة
12. ✅ `two_images_to_prompt` - دمج صورتين في برومبت

**جميع الأدوات تعمل على:** `OpenAI GPT-4o-mini`

---

## 📝 التزامات Git

```bash
# التحويل إلى OpenAI فقط
git commit -m "Switch to OpenAI-only: Remove Gemini API dependencies"
# 18 files changed, 94 insertions(+), 2739 deletions(-)

# ملفات التوثيق
git commit -m "Add Cloudflare Worker update instructions"

# (التحديث الحالي لم يُدفع بعد)
```

---

## 🔍 استكشاف الأخطاء

### مشكلة: "Method not allowed"
**السبب:** الـ API يقبل POST فقط على `/api/ai/generate`
**الحل:** استخدم POST بدلاً من GET في الاختبار

### مشكلة: "CORS not allowed"
**السبب:** `ALLOWED_ORIGIN` لا يتطابق مع نطاق الطلب
**الحل:** 
- للتطوير: استخدم `*`
- للإنتاج: حدد النطاقات بدقة

### مشكلة: "AI generation failed"
**السبب:** مفتاح OpenAI غير صحيح أو منتهي
**الحل:** حدّث `OPENAI_API_KEY` في Variables

### مشكلة: الصور لا تعمل
**السبب:** لم يتم تحديث الكود في Cloudflare
**الحل:** انسخ `WORKER-COMPLETE-CODE.ts` المحدث

---

## 📚 مراجع

- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GPT-4o-mini Pricing](https://openai.com/pricing)

---

## 🎯 الخطوات التالية (اختيارية)

- [ ] إضافة تحليل الأداء (Analytics)
- [ ] تفعيل Caching لتقليل التكلفة
- [ ] إضافة Webhook للتكامل مع أدوات خارجية
- [ ] دعم Streaming للإجابات الطويلة
- [ ] إضافة أدوات جديدة (SEO، Marketing، etc.)

---

**آخر تحديث للملف:** 25 ديسمبر 2025  
**الحالة:** ✅ جاهز للنشر - يحتاج نسخ الكود إلى Cloudflare Worker
