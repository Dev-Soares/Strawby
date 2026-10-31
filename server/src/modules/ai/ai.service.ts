import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LlmProvider } from './llm-provider.interface';
import type { GenerateObjectOptions, GenerateTextOptions } from './types';

export const LLM_PROVIDER = Symbol('LLM_PROVIDER');

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
      throw new InternalServerErrorException('Erro ao gerar texto com IA');
    }
  }

  async generateObject<T>(options: GenerateObjectOptions<T>): Promise<T> {
    this.ensureConfigured();

    try {
      return await this.provider.generateObject(options);
    } catch (error: unknown) {
      this.logger.error(
        { provider: this.provider.name, error: this.errorMessage(error) },
        'Falha ao gerar objeto com IA',
      );
      throw new InternalServerErrorException('Erro ao gerar objeto com IA');
    }
  }

  private ensureConfigured(): void {
    if (!this.provider.isConfigured()) {
      throw new InternalServerErrorException(
        `Provider de IA "${this.provider.name}" não está configurado. Verifique a API key.`,
      );
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }
}
