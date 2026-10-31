import type { z } from 'zod';

export type AiProvider = 'openai' | 'gemini';

export type GenerateTextOptions = {
  system: string;
  prompt: string;
  temperature?: number;
};

export type GenerateObjectOptions<T> = {
  system: string;
  prompt: string;
  schema: z.ZodSchema<T>;
  temperature?: number;
};
