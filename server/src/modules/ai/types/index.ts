import type { z } from 'zod';

export type AiProvider = 'openai' | 'gemini';

export type AiUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type GenerateObjectResult<T> = {
  object: T;
  usage: AiUsage;
};

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
