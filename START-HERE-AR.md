# ⚡ تشغيل فوري - Raqim API (5 دقائق)

## الأوامر الأساسية فقط

### 1️⃣ تثبيت Worker
```powershell
cd raqim-api
npm install
```

### 2️⃣ تسجيل الدخول لـ Cloudflare
```powershell
wrangler login
```
سيفتح المتصفح → وافق

### 3️⃣ ضبط المفاتيح (4 أسرار فقط)
```powershell
wrangler secret put GEMINI_API_KEY
# الصق مفتاحك واضغط Enter

wrangler secret put OPENAI_API_KEY
# الصق مفتاحك واضغط Enter

wrangler secret put OPENAI_OSS_MODEL
# اكتب: gpt-4o-mini واضغط Enter

wrangler secret put ALLOWED_ORIGIN
# اكتب: * واضغط Enter (للتطوير)
```

### 4️⃣ نشر Worker
```powershell
npm run deploy
```
**انسخ الرابط الظاهر!**
مثال: `https://raqim-api.YOUR-NAME.workers.dev`

### 5️⃣ ضبط Frontend
```powershell
cd ..
cp .env.example .env
```

افتح ملف `.env` واكتب:
```
VITE_API_BASE_URL=https://raqim-api.YOUR-NAME.workers.dev
```
(استبدل بالرابط من الخطوة 4)

### 6️⃣ تشغيل التطبيق
```powershell
npm run dev
```

افتح: http://localhost:5173

---

## ✅ اختبار سريع

في المتصفح، جرّب أي أداة → إذا اشتغل، تمام! 🎉

---

## 📊 عرض Logs

```powershell
cd raqim-api
npm run tail
```

---

## 🔄 تحديث Worker لاحقاً

```powershell
cd raqim-api
npm run deploy
```

**انتهى!** 🚀

---

### المشاكل الشائعة

❌ **"Missing secret"**
→ أعد الخطوة 3

❌ **CORS error**
→ تأكد من `.env` فيه الرابط الصحيح

❌ **404 error**
→ تأكد من Worker منشور (الخطوة 4)

---

**للتفاصيل الكاملة**: شاهد `DEPLOYMENT-AR.md`
