/**
 * Gemini Provider
 * REST API integration with Google Generative Language API
 */

import type { AIRequest, AIResponse } from '../types';

export async function callGemini(
  request: AIRequest,
  apiKey: string,
  model: string
): Promise<AIResponse> {
  const startTime = Date.now();
  
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  // Build request payload
  const parts: any[] = [];
  
  if (request.system) {
    parts.push({ text: request.system });
  }
  
  parts.push({ text: request.prompt });
  
  // Add images for vision tasks
  if (request.images && request.images.length > 0) {
    for (const imageData of request.images) {
      // Extract base64 from data URI (data:image/jpeg;base64,...)
      const match = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const [, mimeType, base64] = match;
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
  
  // Extract text from response
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Extract usage metadata
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
