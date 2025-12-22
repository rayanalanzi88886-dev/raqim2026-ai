/**
 * Raqim API Worker
 * Cloudflare Workers API Gateway for Multi-Provider AI Routing
 * 
 * Endpoints:
 *   POST /api/ai/generate - Main AI generation endpoint
 * 
 * Providers:
 *   - Gemini (vision, content creation)
 *   - OpenAI GPT-OSS 120B (prompt engineering)
 */

import type { Env, AIRequest, AIResponse, ErrorResponse } from './types';
import { routeToProvider, getProviderModel } from './router';
import { callGemini } from './providers/gemini';
import { callOpenAI } from './providers/openai';
import { validateCORS, checkRateLimit, validateInput, buildCORSHeaders } from './middleware';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    const corsResponse = validateCORS(request, env);
    if (corsResponse) return corsResponse;
    
    // Only accept POST
    if (request.method !== 'POST') {
      return jsonError('Method not allowed', 'METHOD_NOT_ALLOWED', 405, env);
    }
    
    // Route validation
    const url = new URL(request.url);
    if (url.pathname !== '/api/ai/generate') {
      return jsonError('Endpoint not found', 'NOT_FOUND', 404, env);
    }
    
    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip, env)) {
      return jsonError('Rate limit exceeded', 'RATE_LIMIT', 429, env);
    }
    
    try {
      // Parse request
      const body: AIRequest = await request.json();
      
      // Validate input
      const validation = validateInput(body, env);
      if (!validation.valid) {
        return jsonError(validation.error || 'Invalid input', 'VALIDATION_ERROR', 400, env);
      }
      
      // Route to appropriate provider
      const provider = routeToProvider(body.tool);
      const model = getProviderModel(provider, env);
      
      console.log(`[Raqim API] tool=${body.tool} → provider=${provider} model=${model}`);
      
      let result: AIResponse;
      
      if (provider === 'gemini') {
        result = await callGemini(body, env.GEMINI_API_KEY, model);
      } else {
        result = await callOpenAI(body, env.OPENAI_API_KEY, model);
      }
      
      // Log success
      console.log(`[Raqim API] ✓ ${provider} ${result.latencyMs}ms tokens=${result.usage.inputTokens}+${result.usage.outputTokens}`);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: buildCORSHeaders(env)
      });
      
    } catch (error: any) {
      console.error('[Raqim API] Error:', error);
      return jsonError(
        'AI generation failed',
        'PROVIDER_ERROR',
        500,
        env,
        error.message
      );
    }
  }
};

function jsonError(
  message: string,
  code: string,
  status: number,
  env: Env,
  details?: string
): Response {
  const error: ErrorResponse = {
    error: message,
    code
  };
  
  // Only include details in dev
  if (env.ENVIRONMENT === 'development' && details) {
    (error as any).details = details;
  }
  
  return new Response(JSON.stringify(error), {
    status,
    headers: buildCORSHeaders(env)
  });
}
