// ====================================
// RAQIM API WORKER - COMPLETE CODE
// Copy this entire content into Cloudflare Workers Editor
// ====================================

// ---- TYPES ----
interface AIRequest {
  tool: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
  locale?: 'ar' | 'en';
  images?: string[];
}

interface AIResponse {
  text: string;
  provider: 'openai_oss';
  model: string;
  latencyMs: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

interface ErrorResponse {
  error: string;
  code: string;
  provider?: string;
}

interface Env {
  OPENAI_API_KEY: string;
  OPENAI_OSS_MODEL: string;
  ALLOWED_ORIGIN: string;
  JINA_API_KEY?: string;
  ENVIRONMENT: string;
  MAX_REQUESTS_PER_MINUTE: string;
  MAX_PROMPT_LENGTH: string;
}

// ---- ROUTER ----
// All tools now use OpenAI only
function routeToProvider(tool: string): 'openai_oss' {
  return 'openai_oss';
}

function getProviderModel(provider: 'openai_oss', env: Env): string {
  return env.OPENAI_OSS_MODEL || 'gpt-4o-mini';
}

// ---- OPENAI PROVIDER ----
async function callOpenAI(
  request: AIRequest,
  apiKey: string,
  model: string
): Promise<AIResponse> {
  const startTime = Date.now();
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  
  const messages: any[] = [];
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
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
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
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function parseAllowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGIN || '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function resolveAllowedOrigin(request: Request, env: Env): string | null {
  const allowed = parseAllowedOrigins(env);
  if (allowed.includes('*')) return '*';
  const origin = request.headers.get('Origin');
  if (origin && allowed.includes(origin)) return origin;
  if (!origin && allowed.length > 0) return allowed[0];
  return null;
}

function checkRateLimit(ip: string, env: Env): boolean {
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

function validateInput(body: any, env: Env): { valid: boolean; error?: string } {
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

function buildCORSHeaders(allowedOrigin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
}

// ---- MAIN HANDLER ----
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = resolveAllowedOrigin(request, env) || 'null';
    if (request.method === 'OPTIONS') {
      if (allowedOrigin === 'null') {
        return new Response(JSON.stringify({ error: 'CORS not allowed' }), {
          status: 403,
          headers: buildCORSHeaders(allowedOrigin)
        });
      }
      return new Response(null, {
        status: 204,
        headers: buildCORSHeaders(allowedOrigin)
      });
    }
    
    if (allowedOrigin === 'null') {
      return jsonError('CORS not allowed', 'CORS_FORBIDDEN', 403, allowedOrigin, env);
    }
    
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 'METHOD_NOT_ALLOWED', 405, allowedOrigin, env);
    }
    
    const url = new URL(request.url);
    if (url.pathname !== '/api/ai/generate') {
      return jsonError('Endpoint not found', 'NOT_FOUND', 404, allowedOrigin, env);
    }
    
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip, env)) {
      return jsonError('Rate limit exceeded', 'RATE_LIMIT', 429, allowedOrigin, env);
    }
    
    try {
      const body: AIRequest = await request.json();
      const validation = validateInput(body, env);
      
      if (!validation.valid) {
        return jsonError(validation.error || 'Invalid input', 'VALIDATION_ERROR', 400, allowedOrigin, env);
      }
      
      const provider = routeToProvider(body.tool);
      const model = getProviderModel(provider, env);
      
      console.log(`[Raqim API] tool=${body.tool} → provider=${provider} model=${model}`);
      
      let result: AIResponse;
      
      // Use OpenAI for all tools
      result = await callOpenAI(body, env.OPENAI_API_KEY, model);
      
      console.log(`[Raqim API] ✓ ${provider} ${result.latencyMs}ms tokens=${result.usage.inputTokens}+${result.usage.outputTokens}`);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: buildCORSHeaders(allowedOrigin)
      });
      
    } catch (error: any) {
      console.error('[Raqim API] Error:', error);
      return jsonError('AI generation failed', 'PROVIDER_ERROR', 500, allowedOrigin, env, error.message);
    }
  }
};

function jsonError(
  message: string,
  code: string,
  status: number,
  allowedOrigin: string,
  env: Env,
  details?: string
): Response {
  const error: ErrorResponse = {
    error: message,
    code
  };
  
  if (env.ENVIRONMENT === 'development' && details) {
    (error as any).details = details;
  }
  
  return new Response(JSON.stringify(error), {
    status,
    headers: buildCORSHeaders(allowedOrigin)
  });
}

// ====================================
// END OF CODE - PASTE EVERYTHING ABOVE
// ====================================
