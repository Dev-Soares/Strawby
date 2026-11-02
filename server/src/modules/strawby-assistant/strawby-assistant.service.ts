import { Injectable, Logger } from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { randomUUID } from 'crypto';
import { performance } from 'perf_hooks';
import { AiService } from '../ai/ai.service';
import { FoodService } from '../food/food.service';
import { MealService } from '../meal/meal.service';
import { PrivateFoodService } from '../private-food/private-food.service';
import type { PrivateFoodPublic } from '../private-food/types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import {
  buildExtractMealPrompt,
  EXTRACT_MEAL_SYSTEM_PROMPT,
} from './prompts';
import {
  assistantExtractedMealSchema,
  type AssistantExtractedItem,
  type AssistantExtractedMeal,
} from './types';

type ResolvedItem = {
  name: string;
  quantity: number;
  unit: string;
  foodId?: string;
  privateFoodId?: string;
};

@Injectable()
export class StrawbyAssistantService {
  private readonly logger = new Logger(StrawbyAssistantService.name);

  constructor(
    private readonly ai: AiService,
    private readonly food: FoodService,
    private readonly privateFood: PrivateFoodService,
    private readonly meal: MealService,
  ) {}

  async processMessage(
    callerId: string,
    patientId: string,
    dto: SendAssistantMessageDto,
  ) {
    const totalStart = performance.now();
    this.logger.log({ event: 'assistant_start', patientId });

    const extractStart = performance.now();
    const extracted = await this.extractMeal(dto.message);
    this.logTiming('extract_meal', extractStart, {
      itemCount: extracted.items.length,
    });

    if (extracted.items.length === 0) {
      this.logTiming('total', totalStart, { result: 'no_items' });
      return {
        reply: {
          id: randomUUID(),
          role: 'assistant',
          content:
            'Não consegui identificar alimentos na sua mensagem. Tente descrever o que comeu com mais detalhes.',
          createdAt: new Date().toISOString(),
          suggestedMeals: [],
        },
      };
    }

    const resolveStart = performance.now();
    const resolvedItems = await this.resolveItems(
      callerId,
      patientId,
      extracted.items,
    );
    const validItems = resolvedItems.filter(
      (item) => item.foodId || item.privateFoodId,
    );
    this.logTiming('resolve_items', resolveStart, {
      requestedCount: extracted.items.length,
      resolvedCount: validItems.length,
    });

    if (validItems.length === 0) {
      this.logTiming('total', totalStart, { result: 'no_resolved_items' });
      return {
        reply: {
          id: randomUUID(),
          role: 'assistant',
          content:
            'Não encontrei os alimentos que você descreveu no banco. Tente descrever de outra forma.',
          createdAt: new Date().toISOString(),
          suggestedMeals: [],
        },
      };
    }

    const createStart = performance.now();
    const meal = await this.createMeal(
      callerId,
      patientId,
      extracted,
      validItems,
    );
    this.logTiming('create_meal', createStart, {
      itemCount: meal.items.length,
    });

    this.logTiming('total', totalStart, {
      result: 'success',
      itemCount: meal.items.length,
    });

    return {
      reply: {
        id: randomUUID(),
        role: 'assistant',
        content: `Refeição "${meal.name}" registrada com ${meal.items.length} item(ns).`,
        createdAt: new Date().toISOString(),
        suggestedMeals: [meal],
      },
    };
  }

  private async extractMeal(message: string): Promise<AssistantExtractedMeal> {
    return this.ai.generateObject({
      system: EXTRACT_MEAL_SYSTEM_PROMPT,
      prompt: buildExtractMealPrompt(message, this.currentTime()),
      schema: assistantExtractedMealSchema,
      temperature: 0.3,
    });
  }

  private async resolveItems(
    callerId: string,
    patientId: string,
    items: AssistantExtractedItem[],
  ): Promise<ResolvedItem[]> {
    const privateFoods = await this.privateFood.findAllByPatient(
      callerId,
      patientId,
    );

    return Promise.all(
      items.map(async (item) => {
        const privateMatch = this.findPrivateFoodMatch(item.name, privateFoods);
        if (privateMatch) {
          return {
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            privateFoodId: privateMatch.id,
          };
        }

        const publicMatch = await this.findPublicFoodMatch(item.name);
        if (publicMatch) {
          return {
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            foodId: publicMatch.id,
          };
        }

        return {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        };
      }),
    );
  }

  private findPrivateFoodMatch(
    name: string,
    privateFoods: PrivateFoodPublic[],
  ): PrivateFoodPublic | null {
    const normalizedName = this.normalize(name);

    const exact = privateFoods.find(
      (food) => this.normalize(food.name) === normalizedName,
    );
    if (exact) return exact;

    const contains = privateFoods.find((food) => {
      const normalizedFood = this.normalize(food.name);
      return (
        normalizedFood.includes(normalizedName) ||
        normalizedName.includes(normalizedFood)
      );
    });
    if (contains) return contains;

    return null;
  }

  private async findPublicFoodMatch(name: string) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return null;

    const results = await this.food.search(trimmed);
    if (results.length === 0) return null;

    const normalizedName = this.normalize(trimmed);

    const exact = results.find(
      (food) => this.normalize(food.name) === normalizedName,
    );
    if (exact) return exact;

    const contains = results.find((food) =>
      this.normalize(food.name).includes(normalizedName),
    );
    if (contains) return contains;

    return results[0];
  }

  private async createMeal(
    callerId: string,
    patientId: string,
    extracted: AssistantExtractedMeal,
    resolvedItems: ResolvedItem[],
  ) {
    return this.meal.createWithItems(
      callerId,
      patientId,
      {
        kind: MealKind.DAILY,
        mealType: extracted.mealType ?? undefined,
        time: extracted.time ?? undefined,
        observations: extracted.observations ?? undefined,
      },
      resolvedItems.map((item) => ({
        foodId: item.foodId,
        privateFoodId: item.privateFoodId,
        quantity: item.quantity,
      })),
    );
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private currentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private logTiming(
    phase: string,
    start: number,
    meta: Record<string, unknown> = {},
  ): void {
    const durationMs = performance.now() - start;
    this.logger.log({ event: 'assistant_timing', phase, durationMs, ...meta });
  }
}
