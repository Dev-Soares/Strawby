import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import type { LlmProvider } from './llm-provider.interface';
import type {
  GenerateObjectOptions,
  GenerateObjectResult,
  GenerateTextOptions,
} from './types';

@Injectable()
export class OpenAiProvider implements LlmProvider {
  readonly name = 'openai';

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.getConfig('OPENAI_API_KEY'));
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const model = this.buildModel();

    const { text } = await generateText({
      model,
      system: options.system,
      prompt: options.prompt,
      temperature: options.temperature ?? 0.7,
    });

    return text;
  }

  async generateObject<T>(
    options: GenerateObjectOptions<T>,
  ): Promise<GenerateObjectResult<T>> {
    const model = this.buildModel();

    const { object, usage } = await generateObject({
      model,
      schema: options.schema,
      system: options.system,
      prompt: options.prompt,
      temperature: options.temperature ?? 0.3,
    });

    return {
      object,
      usage: {
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        totalTokens: usage.totalTokens ?? 0,
      },
    };
  }

  private buildModel() {
    const apiKey = this.getConfig('OPENAI_API_KEY');
    const baseURL = this.getConfig('OPENAI_BASE_URL');
    const modelId = this.getConfig('OPENAI_MODEL') ?? 'gpt-4o-mini';

    const options: { apiKey?: string; baseURL?: string } = { apiKey };
    if (baseURL) {
      options.baseURL = baseURL;
    }

    return createOpenAI(options)(modelId);
  }

  private getConfig(key: string): string | undefined {
    const value = this.config.get<string>(key);
    return value && value.trim().length > 0 ? value : undefined;
  }
}
