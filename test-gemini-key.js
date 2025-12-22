// اختبار مفتاح Gemini API
const apiKey = 'AIzaSyAHZiRcRqhpVKhng0DhKCslp5o5YME34X8';

async function testGeminiKey() {
  console.log('🔍 اختبار مفتاح Gemini API...\n');
  
  const model = 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{ text: 'hello' }]
    }],
    generationConfig: {
      maxOutputTokens: 100
    }
  };
  
  try {
    console.log(`📡 يرسل طلب إلى: ${model}`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ المفتاح يعمل بنجاح!\n');
      console.log('النتيجة:', data.candidates?.[0]?.content?.parts?.[0]?.text || 'تم');
      console.log('\nالمفتاح جاهز للاستخدام ✓');
      return true;
    } else {
      console.log('❌ خطأ:', data.error?.message || 'خطأ غير معروف');
      return false;
    }
  } catch (error) {
    console.log('❌ فشل الاتصال:', error.message);
    return false;
  }
}

testGeminiKey();
