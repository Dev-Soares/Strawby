import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AiService } from '../ai/ai.service';
import { FoodService } from '../food/food.service';
import { MealService } from '../meal/meal.service';
import { PrivateFoodService } from '../private-food/private-food.service';
import type { PrivateFoodPublic } from '../private-food/types';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import {
  buildMealPrompt,
  buildSearchPrompt,
  MEAL_SYSTEM_PROMPT,
  SEARCH_SYSTEM_PROMPT,
} from './prompts';
import {
  assistantMealSchema,
  assistantSearchSchema,
  type AssistantMeal,
  type AssistantMealItem,
} from './types';

const MAX_CANDIDATES = 20;

type CandidateFood = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'public' | 'private';
};

@Injectable()
export class StrawbyAssistantService {
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
    const search = await this.extractSearchQueries(dto.message);
    const candidates = await this.findCandidates(
      callerId,
      patientId,
      search.queries,
    );
    const mealData = await this.buildMeal(dto.message, candidates);

    if (mealData.items.length === 0) {
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

    const meal = await this.createMealFromAssistant(
      callerId,
      patientId,
      mealData,
    );

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

  private async extractSearchQueries(message: string) {
    return this.ai.generateObject({
      system: SEARCH_SYSTEM_PROMPT,
      prompt: buildSearchPrompt(message),
      schema: assistantSearchSchema,
      temperature: 0.3,
    });
  }

  private async findCandidates(
    callerId: string,
    patientId: string,
    queries: string[],
  ): Promise<CandidateFood[]> {
    const publicFoods = await Promise.all(
      queries.map((query) => this.food.search(query)),
    );

    const privateFoods = await this.privateFood.findAllByPatient(
      callerId,
      patientId,
    );

    const publicCandidates: CandidateFood[] = publicFoods
      .flat()
      .map((food) => ({
        id: food.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        source: 'public' as const,
      }));

    const privateCandidates: CandidateFood[] = this.filterPrivateFoods(
      privateFoods,
      queries,
    ).map((food) => ({
      id: food.id,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      source: 'private' as const,
    }));

    const allCandidates = this.deduplicate([
      ...publicCandidates,
      ...privateCandidates,
    ]);

    return allCandidates.slice(0, MAX_CANDIDATES);
  }

  private filterPrivateFoods(
    privateFoods: PrivateFoodPublic[],
    queries: string[],
  ): PrivateFoodPublic[] {
    const normalizedQueries = queries.map((q) => this.normalize(q));

    return privateFoods.filter((food) => {
      const normalizedName = this.normalize(food.name);
      return normalizedQueries.some((query) => normalizedName.includes(query));
    });
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private deduplicate(candidates: CandidateFood[]): CandidateFood[] {
    const seen = new Set<string>();
    return candidates.filter((candidate) => {
      const key = `${candidate.source}:${candidate.id}`;

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private async buildMeal(
    message: string,
    candidates: CandidateFood[],
  ): Promise<AssistantMeal> {
    if (candidates.length === 0) {
      return {
        name: 'Refeição',
        items: [],
      } as AssistantMeal;
    }

    return this.ai.generateObject({
      system: MEAL_SYSTEM_PROMPT,
      prompt: buildMealPrompt(message, candidates, this.currentTime()),
      schema: assistantMealSchema,
      temperature: 0.3,
    });
  }

  private async createMealFromAssistant(
    callerId: string,
    patientId: string,
    mealData: AssistantMeal,
  ) {
    const created = await this.meal.create(callerId, patientId, {
      kind: MealKind.DAILY,
      mealType: mealData.mealType,
      time: mealData.time,
      observations: mealData.observations,
    });

    for (const item of mealData.items) {
      await this.addItem(callerId, patientId, created.id, item);
    }

    return this.meal.findOne(callerId, patientId, created.id);
  }

  private async addItem(
    callerId: string,
    patientId: string,
    mealId: string,
    item: AssistantMealItem,
  ) {
    if (item.privateFoodId) {
      return this.meal.addPrivateFoodItem(callerId, patientId, mealId, {
        privateFoodId: item.privateFoodId,
        quantity: item.quantity,
      });
    }

    if (!item.foodId) {
      throw new InternalServerErrorException(
        'Item da refeição não possui foodId nem privateFoodId',
      );
    }

    return this.meal.addFoodItem(callerId, patientId, mealId, {
      foodId: item.foodId,
      quantity: item.quantity,
    });
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
