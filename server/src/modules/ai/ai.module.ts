import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService, LLM_PROVIDER } from './ai.service';
import { GeminiProvider } from './gemini.provider';
import { OpenAiProvider } from './openai.provider';
import type { AiProvider } from './types';

@Module({
  providers: [
    OpenAiProvider,
    GeminiProvider,
    {
      provide: LLM_PROVIDER,
      useFactory: (
        config: ConfigService,
        openai: OpenAiProvider,
        gemini: GeminiProvider,
      ) => {
        const provider = (
          config.get<AiProvider>('AI_PROVIDER') ?? 'openai'
        ).toLowerCase() as AiProvider;

        switch (provider) {
          case 'gemini':
            return gemini;
          case 'openai':
          default:
            return openai;
        }
      },
      inject: [ConfigService, OpenAiProvider, GeminiProvider],
    },
    AiService,
  ],
  exports: [AiService],
})
export class AiModule {}
