# 🚀 Cloudflare Worker Setup - Manual Steps

## ✅ في Cloudflare Dashboard الذي تراه الآن:

### الخطوة 1: إنشاء Worker جديد
```
1. اضغط على "Create application" (الزر الأزرق)
2. اختر "Worker" من الخيارات
3. أسمّه: raqim-api
4. اضغط "Deploy"
```

### الخطوة 2: استبدل كل الـ Code
```
1. بعد الإنشاء، افتح Worker editor
2. احذف كل الكود الافتراضي
3. انسخ محتوى: WORKER-COMPLETE-CODE.ts (من مجلد المشروع)
4. الصق الكود كاملاً في الـ editor
5. اضغط "Save and Deploy"
```

### الخطوة 3: اضبط الـ Environment Variables (Secrets)
```
من نفس صفحة Worker:
1. اذهب لـ "Settings" أو "Environment Variables"
2. أضف الـ 4 Secrets التالية:

   - GEMINI_API_KEY = [paste your Gemini API key]
   - OPENAI_API_KEY = [paste your OpenAI API key]
   - OPENAI_OSS_MODEL = gpt-4o-mini
   - ALLOWED_ORIGIN = * (للتطوير) أو https://yourdomain.com

3. اضغط "Save"
```

### الخطوة 4: نسخ الرابط
```
بعد الحفظ، انسخ رابط Worker:
https://raqim-api.YOUR-SUBDOMAIN.workers.dev

(ستجده في شريط العنوان أو في صفحة Worker)
```

### الخطوة 5: اضبط Frontend
```
في مجلد المشروع الرئيسي:
1. افتح ملف .env
2. اضبط:
   VITE_API_BASE_URL=https://raqim-api.YOUR-SUBDOMAIN.workers.dev

3. احفظ
```

### الخطوة 6: تشغيل Frontend
```powershell
cd C:\Users\basel\Downloads\raqim-ai-(رقيم)---مولد-أوامر-الذكاء-الاصطناعي
npm run dev
```

---

## ✅ ملخص سريع:
- ✅ نسخ Worker code → Cloudflare editor
- ✅ ضبط 4 Secrets (API keys)
- ✅ نسخ رابط Worker
- ✅ تحديث .env في Frontend
- ✅ تشغيل Frontend

**الآن جاهز للاختبار!** ✨
