/**
 * Raqim API Types
 * Unified request/response interfaces for multi-provider AI routing
 */

export interface AIRequest {
  tool: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
  locale?: 'ar' | 'en';
  images?: string[]; // base64 data URIs for vision tasks
}

export interface AIResponse {
  text: string;
  provider: 'gemini' | 'openai_oss';
  model: string;
  latencyMs: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ErrorResponse {
  error: string;
  code: string;
  provider?: string;
}

export interface Env {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  OPENAI_OSS_MODEL: string;
  ALLOWED_ORIGIN: string;
  JINA_API_KEY?: string;
  ENVIRONMENT: string;
  MAX_REQUESTS_PER_MINUTE: string;
  MAX_PROMPT_LENGTH: string;
}

export type ProviderType = 'gemini' | 'openai_oss';

export interface ProviderConfig {
  apiKey: string;
  model: string;
  endpoint: string;
}
