/**
 * Security Middleware
 * CORS, Rate Limiting, Input Validation
 */

import type { Env } from './types';

// Simple in-memory rate limiter (resets on Worker restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function validateCORS(request: Request, env: Env): Response | null {
  const origin = request.headers.get('Origin');
  const allowedOrigin = env.ALLOWED_ORIGIN || '*';
  
  // Preflight
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

export function checkRateLimit(ip: string, env: Env): boolean {
  const maxRequests = parseInt(env.MAX_REQUESTS_PER_MINUTE || '30');
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  
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

export function validateInput(body: any, env: Env): { valid: boolean; error?: string } {
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

export function buildCORSHeaders(env: Env): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}
