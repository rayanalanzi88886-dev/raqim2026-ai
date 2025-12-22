/**
 * OpenAI Provider (GPT-OSS 120B via Responses API)
 * High-performance open-source model for prompt engineering
 */

import type { AIRequest, AIResponse } from '../types';

export async function callOpenAI(
  request: AIRequest,
  apiKey: string,
  model: string
): Promise<AIResponse> {
  const startTime = Date.now();
  
  // OpenAI Responses API endpoint
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  
  const messages: any[] = [];
  
  if (request.system) {
    messages.push({
      role: 'system',
      content: request.system
    });
  }
  
  messages.push({
    role: 'user',
    content: request.prompt
  });
  
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
