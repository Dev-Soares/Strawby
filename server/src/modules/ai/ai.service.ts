import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AI_UNAVAILABLE_MESSAGE, LLM_PROVIDER } from './ai.constants';
import type { LlmProvider } from './llm-provider.interface';
import type {
  GenerateObjectOptions,
  GenerateObjectResult,
  GenerateTextOptions,
} from './types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly config: ConfigService,
    @Inject(LLM_PROVIDER) private readonly provider: LlmProvider,
  ) {}

  async generateText(options: GenerateTextOptions): Promise<string> {
    this.ensureConfigured();

    try {
      return await this.provider.generateText(options);
    } catch (error: unknown) {
      this.logger.error(
        { provider: this.provider.name, error: this.errorMessage(error) },
        'Falha ao gerar texto com IA',
      );
      throw new ServiceUnavailableException(AI_UNAVAILABLE_MESSAGE);
    }
  }

  async generateObject<T>(
    options: GenerateObjectOptions<T>,
  ): Promise<GenerateObjectResult<T>> {
    this.ensureConfigured();

    try {
      return await this.provider.generateObject(options);
    } catch (error: unknown) {
      this.logger.error(
        { provider: this.provider.name, error: this.errorMessage(error) },
        'Falha ao gerar objeto com IA',
      );
      throw new ServiceUnavailableException(AI_UNAVAILABLE_MESSAGE);
    }
  }

  private ensureConfigured(): void {
    if (!this.provider.isConfigured()) {
      this.logger.error(
        { provider: this.provider.name },
        'Provider de IA sem API key configurada',
      );
      throw new ServiceUnavailableException(AI_UNAVAILABLE_MESSAGE);
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }
}
