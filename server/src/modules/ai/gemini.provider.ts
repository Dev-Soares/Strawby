import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createGoogle } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import type { LlmProvider } from './llm-provider.interface';
import type {
  GenerateObjectOptions,
  GenerateObjectResult,
  GenerateTextOptions,
} from './types';

@Injectable()
export class GeminiProvider implements LlmProvider {
  readonly name = 'gemini';

  private readonly googleProvider: ReturnType<typeof createGoogle>;

  constructor(private readonly config: ConfigService) {
    this.googleProvider = createGoogle({
      apiKey: this.config.get<string>('GEMINI_API_KEY') ?? undefined,
    });
  }

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('GEMINI_API_KEY'));
  }

  async generateText(options: GenerateTextOptions): Promise<string> {
    const modelId =
      this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.0-flash';

    const { text } = await generateText({
      model: this.googleProvider(modelId),
      system: options.system,
      prompt: options.prompt,
      temperature: options.temperature ?? 0.7,
    });

    return text;
  }

  async generateObject<T>(
    options: GenerateObjectOptions<T>,
  ): Promise<GenerateObjectResult<T>> {
    const modelId =
      this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.0-flash';

    const { object, usage } = await generateObject({
      model: this.googleProvider(modelId),
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
}
