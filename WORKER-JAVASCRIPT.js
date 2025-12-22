// ====================================
// RAQIM API WORKER - JAVASCRIPT VERSION
// Copy this entire content into Cloudflare Workers Editor
// ====================================

// ---- ROUTER ----
const VISION_TOOLS = [
  'image_to_prompt',
  'image_to_text',
  'two_images_to_prompt',
  'image_prompt',
  'video_prompt'
];

const OPENAI_TOOLS = [
  'prompt_refiner',
  'prompt_checker',
  'advanced_prompt'
];

function routeToProvider(tool) {
  if (VISION_TOOLS.includes(tool)) {
    return 'gemini';
  }
  if (OPENAI_TOOLS.includes(tool)) {
    return 'openai_oss';
  }
  return 'gemini';
}

function getProviderModel(provider, env) {
  if (provider === 'openai_oss') {
    return env.OPENAI_OSS_MODEL || 'gpt-4o-mini';
  }
  return 'gemini-2.5-flash';
}

// ---- GEMINI PROVIDER ----
async function callGemini(request, apiKey, model) {
  const startTime = Date.now();
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
  
  const parts = [];
  if (request.system) {
    parts.push({ text: request.system });
  }
  parts.push({ text: request.prompt });
  
  if (request.images && request.images.length > 0) {
    for (const imageData of request.images) {
      const match = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64 = match[2];
        parts.push({
          inlineData: {
            mimeType: `image/${mimeType}`,
            data: base64
          }
        });
      }
    }
  }
  
  const payload = {
    contents: [{ parts }],
    generationConfig: {
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxOutputTokens ?? 2048,
    }
  };
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const usage = {
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0
  };
  
  return {
    text,
    provider: 'gemini',
    model,
    latencyMs: Date.now() - startTime,
    usage
  };
}

// ---- OPENAI PROVIDER ----
async function callOpenAI(request, apiKey, model) {
  const startTime = Date.now();
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  
  // تحقق من وجود المفتاح
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in Cloudflare Secrets');
  }
  
  const messages = [];
  if (request.system) {
    messages.push({ role: 'system', content: request.system });
  }
  messages.push({ role: 'user', content: request.prompt });
  
  const payload = {
    model,
    messages,
    temperature: request.temperature ?? 0.4,
    max_tokens: request.maxOutputTokens ?? 900,
    stream: false
  };
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorBody = await response.text();
    const errorMsg = `OpenAI Error ${response.status}: ${errorBody}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  const usage = {
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0
  };
  
  return {
    text,
    provider: 'openai_oss',
    model,
    latencyMs: Date.now() - startTime,
    usage
  };
}

// ---- MIDDLEWARE ----
const rateLimitMap = new Map();

function validateCORS(request, env) {
  const allowedOrigin = env.ALLOWED_ORIGIN || '*';
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  return null;
}

function checkRateLimit(ip, env) {
  const maxRequests = parseInt(env.MAX_REQUESTS_PER_MINUTE || '30');
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

function validateInput(body, env) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid JSON body' };
  }
  
  if (!body.tool || typeof body.tool !== 'string') {
    return { valid: false, error: 'Missing or invalid tool' };
  }
  
  if (!body.prompt || typeof body.prompt !== 'string') {
    return { valid: false, error: 'Missing or invalid prompt' };
  }
  
  const maxLength = parseInt(env.MAX_PROMPT_LENGTH || '20000');
  if (body.prompt.length > maxLength) {
    return { valid: false, error: `Prompt exceeds ${maxLength} characters` };
  }
  
  return { valid: true };
}

function buildCORSHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

function jsonError(message, code, status, env, details) {
  const error = {
    error: message,
    code
  };
  
  if (env.ENVIRONMENT === 'production' && details) {
    error.details = details;
  }
  
  return new Response(JSON.stringify(error), {
    status,
    headers: buildCORSHeaders(env)
  });
}

// ---- MAIN HANDLER ----
export default {
  async fetch(request, env) {
    const corsResponse = validateCORS(request, env);
    if (corsResponse) return corsResponse;
    
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 'METHOD_NOT_ALLOWED', 405, env);
    }
    
    const url = new URL(request.url);
    if (url.pathname !== '/api/ai/generate') {
      return jsonError('Endpoint not found', 'NOT_FOUND', 404, env);
    }
    
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip, env)) {
      return jsonError('Rate limit exceeded', 'RATE_LIMIT', 429, env);
    }
    
    try {
      const body = await request.json();
      const validation = validateInput(body, env);
      
      if (!validation.valid) {
        return jsonError(validation.error || 'Invalid input', 'VALIDATION_ERROR', 400, env);
      }
      
      const provider = routeToProvider(body.tool);
      const model = getProviderModel(provider, env);
      
      console.log(`[Raqim API] tool=${body.tool} → provider=${provider} model=${model}`);
      
      let result;
      
      if (provider === 'gemini') {
        result = await callGemini(body, env.GEMINI_API_KEY, model);
      } else {
        result = await callOpenAI(body, env.OPENAI_API_KEY, model);
      }
      
      console.log(`[Raqim API] ✓ ${provider} ${result.latencyMs}ms tokens=${result.usage.inputTokens}+${result.usage.outputTokens}`);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: buildCORSHeaders(env)
      });
      
    } catch (error) {
      const errorMsg = error.message || String(error);
      console.error('[Raqim API] Error:', errorMsg);
      
      // اعيد رسالة الخطأ بالكامل للتشخيص
      return new Response(JSON.stringify({
        error: errorMsg,
        code: 'PROVIDER_ERROR',
        debug: env.ENVIRONMENT === 'production' ? undefined : { stack: error.stack }
      }), {
        status: 500,
        headers: buildCORSHeaders(env)
      });
    }
  }
};

// ====================================
// END OF CODE - PASTE EVERYTHING ABOVE
// ====================================
