/**
 * Router: Maps tools to AI providers
 * Based on task type: vision → Gemini, prompt engineering → OpenAI GPT-OSS
 */

import type { ProviderType } from './types';

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

export function routeToProvider(tool: string): ProviderType {
  // Vision tasks always go to Gemini (native multimodal)
  if (VISION_TOOLS.includes(tool)) {
    return 'gemini';
  }
  
  // Prompt engineering → OpenAI GPT-OSS 120B
  if (OPENAI_TOOLS.includes(tool)) {
    return 'openai_oss';
  }
  
  // Default: Gemini (content creation, social, etc.)
  return 'gemini';
}

export function getProviderModel(provider: ProviderType, env: any): string {
  if (provider === 'openai_oss') {
    return env.OPENAI_OSS_MODEL || 'gpt-oss-120b';
  }
  return 'gemini-2.0-flash-exp'; // Fast model for production
}
