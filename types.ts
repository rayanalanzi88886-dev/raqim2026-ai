
import { ReactNode } from 'react';

export enum ToolType {
  PROMPT_GEN = 'PROMPT_GEN',
  PROMPT_CHECK = 'PROMPT_CHECK',
  ADVANCED_PROMPT = 'ADVANCED_PROMPT',
  IMAGE_PROMPT = 'IMAGE_PROMPT',
  VIDEO_PROMPT = 'VIDEO_PROMPT',
  TEXT_DETECTOR = 'TEXT_DETECTOR',
  REWRITE = 'REWRITE',
  IMAGE_TO_PROMPT = 'IMAGE_TO_PROMPT',
  IMAGE_TO_TEXT = 'IMAGE_TO_TEXT',
  TWO_IMAGES_TO_PROMPT = 'TWO_IMAGES_TO_PROMPT',
  PRODUCT_DESC = 'PRODUCT_DESC',
  BLOG_TO_THREAD = 'BLOG_TO_THREAD'
}

export interface ToolMetadata {
  id: ToolType;
  title: string;
  description: string;
  icon: ReactNode;
  placeholder: string;
  promptTemplate: string;
  example?: string;
}
