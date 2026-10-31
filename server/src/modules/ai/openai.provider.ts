import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import type { LlmProvider } from './llm-provider.interface';
import type { GenerateObjectOptions, GenerateTextOptions } from './types';

@Injectable()
export class OpenAiProvider implements LlmProvider {
  readonly name = 'openai';

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('OPENAI_API_KEY'));
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const modelId = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    const { text } = await generateText({
      model: openai(modelId),
      system: options.system,
      prompt: options.prompt,
      temperature: options.temperature ?? 0.7,
    });

    return text;
  }

  async generateObject<T>(options: GenerateObjectOptions<T>): Promise<T> {
    const modelId = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    const { object } = await generateObject({
      model: openai(modelId),
      schema: options.schema,
      system: options.system,
      prompt: options.prompt,
      temperature: options.temperature ?? 0.3,
    });

    return object;
  }
}
