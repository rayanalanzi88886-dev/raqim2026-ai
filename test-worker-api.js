// اختبار Worker API مع 3 طلبات مختلفة
const WORKER_URL = 'https://raqim-api.baselainze.workers.dev/api/ai/generate';

async function testAPI(tool, prompt) {
  console.log(`\n🔍 اختبار: ${tool}`);
  console.log(`📝 Prompt: ${prompt}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, prompt })
    });
    
    const data = await response.json();
    const requestTime = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`✅ نجح!`);
      console.log(`📊 Provider: ${data.provider}`);
      console.log(`🤖 Model: ${data.model}`);
      console.log(`⚡ Latency: ${data.latencyMs}ms (API) + ${requestTime - data.latencyMs}ms (network)`);
      console.log(`📈 Tokens: ${data.usage.inputTokens} in → ${data.usage.outputTokens} out`);
      console.log(`💬 Response: ${data.text.substring(0, 100)}...`);
    } else {
      console.log(`❌ خطأ: ${data.error}`);
      console.log(`🔴 Code: ${data.code}`);
    }
  } catch (error) {
    console.log(`❌ فشل الاتصال: ${error.message}`);
  }
  
  console.log('-'.repeat(80));
}

async function runTests() {
  console.log('🚀 بدء اختبار Worker API...\n');
  console.log('Worker URL:', WORKER_URL);
  console.log('='.repeat(80));
  
  // Test 1: OpenAI (prompt_refiner)
  await testAPI('prompt_refiner', 'Write a story about a cat');
  
  // Test 2: Gemini (social_tool)
  await testAPI('social_tool', 'Create a tweet about AI');
  
  // Test 3: Gemini (blog_to_thread)
  await testAPI('blog_to_thread', 'Turn this into a thread: AI is changing the world');
  
  console.log('\n✅ الاختبار انتهى!');
}

runTests();
