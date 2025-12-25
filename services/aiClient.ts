/**
 * AI Client
 * Frontend client for Raqim API Worker (replaces direct Gemini calls)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.raqim.me';

// Map frontend ToolType enum to backend tool strings
const TOOL_MAP: Record<string, string> = {
  'PROMPT_GEN': 'prompt_refiner',
  'PROMPT_CHECK': 'prompt_checker',
  'ADVANCED_PROMPT': 'advanced_prompt',
  'IMAGE_PROMPT': 'image_prompt',
  'VIDEO_PROMPT': 'video_prompt',
  'TEXT_DETECTOR': 'text_detector',
  'REWRITE': 'rewrite',
  'IMAGE_TO_PROMPT': 'image_to_prompt',
  'IMAGE_TO_TEXT': 'image_to_text',
  'TWO_IMAGES_TO_PROMPT': 'two_images_to_prompt',
  'PRODUCT_DESC': 'product_desc',
  'BLOG_TO_THREAD': 'blog_to_thread',
  'DIALECT_CONVERTER': 'dialect_converter',
  'AI_PERSONA': 'ai_persona',
  'SEO_META': 'seo_meta',
  'HASHTAG_GEN': 'hashtag_gen',
  'PROMPT_BUILDER': 'prompt_builder',
  'BRAND_STRATEGY': 'brand_strategy'
};

export interface AIClientRequest {
  tool: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxOutputTokens?: number;
  locale?: 'ar' | 'en';
  images?: string[];
}

export interface AIClientResponse {
  text: string;
  provider: 'openai_oss';
  model: string;
  latencyMs: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIMediaResponse {
  url: string;
  type: 'image' | 'video';
  revisedPrompt?: string;
}

/**
 * Main AI generation function - calls Worker instead of Gemini directly
 */
export async function generateAI(request: AIClientRequest): Promise<AIClientResponse> {
  try {
    // Map tool name to backend format
    const mappedTool = TOOL_MAP[request.tool] || request.tool.toLowerCase();
    
    const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...request,
        tool: mappedTool
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'AI generation failed');
    }

    const data: AIClientResponse = await response.json();
    // Log metadata (optional)
    console.log(`[AI] ${data.provider}/${data.model} - ${data.latencyMs}ms - ${data.usage.inputTokens}+${data.usage.outputTokens} tokens`);
    return data;
  } catch (error: any) {
    console.error('AI Client Error:', error);
    throw new Error(error.message || 'Failed to connect to AI service');
  }
}

/**
 * Generate Media (Image/Video) via Gemini (Imagen-3 / Veo)
 */
export async function generateMedia(prompt: string, type: 'image' | 'video'): Promise<AIMediaResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        type,
        model: type === 'image' ? 'imagen-3' : 'veo'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Media generation failed');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Media Client Error:', error);
    throw new Error(error.message || 'Failed to generate media');
  }
}

/**
 * Fetch URL content via Worker (if we move Jina to backend)
 * For now, keep this client-side or implement in Worker later
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const text = await response.text();
    // Truncate to 15,000 characters to avoid prompt limit errors
    return text.length > 15000 ? text.substring(0, 15000) + "..." : text;
  } catch (error) {
    console.error("Jina Reader Error:", error);
    throw new Error("Failed to extract content from the URL.");
  }
}
