import { Injectable } from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AiService } from '../ai/ai.service';
import { FoodService } from '../food/food.service';
import { MealService } from '../meal/meal.service';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { findPublicFoodMatch } from './utils/food-matching.util';
import {
  buildExtractMealPrompt,
  EXTRACT_MEAL_SYSTEM_PROMPT,
} from './prompts/meal-extraction.prompts';
import {
  assistantExtractedMealSchema,
  type AssistantExtractedItem,
  type AssistantExtractedMeal,
} from './types/meal-extraction.types';

type ResolvedItem = {
  name: string;
  quantity: number;
  unit: string;
  foodId?: string;
};

@Injectable()
export class MealExtractionAssistantService {
  constructor(
    private readonly ai: AiService,
    private readonly food: FoodService,
    private readonly meal: MealService,
  ) {}

  async createMealFromMessage(
    callerId: string,
    patientId: string,
    dto: SendAssistantMessageDto,
  ) {
    const extracted = await this.extractMeal(dto.message);

    if (extracted.items.length === 0) {
      return {
        reply: {
          id: randomUUID(),
          role: 'assistant',
          content:
            'Não consegui identificar alimentos na sua mensagem. Tente descrever o que comeu com mais detalhes.',
          createdAt: new Date().toISOString(),
          status: 'not_understood',
          suggestedMeals: [],
        },
      };
    }

    const resolvedItems = await this.resolveItems(extracted.items);
    const validItems = resolvedItems.filter((item) => item.foodId);

    if (validItems.length === 0) {
      return {
        reply: {
          id: randomUUID(),
          role: 'assistant',
          content:
            'Não encontrei os alimentos que você descreveu no banco. Tente descrever de outra forma.',
          createdAt: new Date().toISOString(),
          status: 'not_found',
          suggestedMeals: [],
        },
      };
    }

    const meal = await this.createMeal(
      callerId,
      patientId,
      extracted,
      validItems,
    );

    return {
      reply: {
        id: randomUUID(),
        role: 'assistant',
        content: this.buildCreatedMessage(meal.name, meal.items.length),
        createdAt: new Date().toISOString(),
        status: 'created',
        suggestedMeals: [meal],
      },
    };
  }

  /** Comemoração do registro — variada pro assistente não soar robótico. */
  private buildCreatedMessage(mealName: string, itemCount: number): string {
    const openings = ['Prontinho!', 'Boa!', 'Feito!', 'Pode deixar!', 'Anotado!'];
    const opening = openings[Math.floor(Math.random() * openings.length)];
    const items = itemCount === 1 ? '1 item' : `${itemCount} itens`;

    return `${opening} Registrei "${mealName}" com ${items} no seu diário de hoje.`;
  }

  private async extractMeal(message: string): Promise<AssistantExtractedMeal> {
    const { object } = await this.ai.generateObject({
      system: EXTRACT_MEAL_SYSTEM_PROMPT,
      prompt: buildExtractMealPrompt(message, this.currentTime()),
      schema: assistantExtractedMealSchema,
      temperature: 0.3,
    });
    return object;
  }

  private async resolveItems(
    items: AssistantExtractedItem[],
  ): Promise<ResolvedItem[]> {
    return Promise.all(
      items.map(async (item) => {
        const publicMatch = await this.findFoodMatch(item.name);
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

  private async findFoodMatch(name: string) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return null;

    const match = await findPublicFoodMatch(trimmed, this.food);
    if (match) return match;

    const simplified = this.simplifyName(trimmed);
    if (simplified && simplified !== trimmed) {
      return findPublicFoodMatch(simplified, this.food);
    }

    return null;
  }

  private simplifyName(name: string): string | null {
    const stopwords = [
      'mexido',
      'frito',
      'grelhado',
      'assado',
      'refogado',
      'natural',
      'morno',
      'gelado',
      'seco',
      'desnatado',
      'integral',
      'light',
      'diet',
      'zero',
      'cremoso',
      'tradicional',
    ];

    const words = name.toLowerCase().split(/\s+/);
    const filtered = words.filter((word) => !stopwords.includes(word));

    if (filtered.length === 0) return null;
    if (filtered.length === words.length) return null;

    return filtered.join(' ');
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
        quantity: item.quantity,
      })),
    );
  }

  private currentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}
