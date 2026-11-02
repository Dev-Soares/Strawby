import type {
  GenerateObjectOptions,
  GenerateObjectResult,
  GenerateTextOptions,
} from './types';

export interface LlmProvider {
  readonly name: string;

  isConfigured(): boolean;

  generateText(options: GenerateTextOptions): Promise<string>;

  generateObject<T>(
    options: GenerateObjectOptions<T>,
  ): Promise<GenerateObjectResult<T>>;
}
