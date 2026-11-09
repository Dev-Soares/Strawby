import { Injectable } from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { randomUUID } from 'crypto';
import { AiService } from '../ai/ai.service';
import { FoodService } from '../food/food.service';
import { MealService } from '../meal/meal.service';
import { UserService } from '../user/user.service';
import { SendAssistantMessageDto } from './dto/send-message.dto';
import { ConfirmMealDto } from './dto/confirm-meal.dto';
import type { FoodPublic } from '../food/types';
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
  food?: FoodPublic;
};

/** Refeição montada mas ainda não salva — o usuário precisa confirmar. */
type MealDraftItem = {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MealDraft = {
  name: string;
  mealType: string | null;
  time: string | null;
  observations: string | null;
  items: MealDraftItem[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
};

@Injectable()
export class MealExtractionAssistantService {
  constructor(
    private readonly ai: AiService,
    private readonly food: FoodService,
    private readonly meal: MealService,
    private readonly user: UserService,
  ) {}

  /**
   * Monta a refeição a partir da mensagem mas NÃO salva — devolve um rascunho
   * pro usuário conferir. A gravação acontece em `confirmMeal`.
   *
   * Único ponto do assistente que chama o LLM, então é aqui — e só aqui — que
   * a cota diária é cobrada. Os caminhos de "não entendi" e "não encontrei"
   * também consomem: a chamada paga já aconteceu.
   */
  async previewMealFromMessage(
    callerId: string,
    patientId: string,
    dto: SendAssistantMessageDto,
  ) {
    await this.user.consumeAssistantQuota(callerId);
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
    const validItems = resolvedItems.filter((item) => item.food);
    const missingNames = resolvedItems
      .filter((item) => !item.food)
      .map((item) => item.name);

    if (validItems.length === 0) {
      return {
        reply: {
          id: randomUUID(),
          role: 'assistant',
          content: `Não encontrei ${this.joinNames(missingNames)} no meu banco de alimentos. Tente descrever de outra forma.`,
          createdAt: new Date().toISOString(),
          status: 'not_found',
          suggestedMeals: [],
        },
      };
    }

    const draft = this.buildDraft(extracted, validItems);

    return {
      reply: {
        id: randomUUID(),
        role: 'assistant',
        content: this.buildPreviewMessage(draft, missingNames),
        createdAt: new Date().toISOString(),
        status: 'preview',
        draft,
        suggestedMeals: [],
      },
    };
  }

  /** Grava o rascunho que o usuário confirmou. */
  async confirmMeal(callerId: string, patientId: string, dto: ConfirmMealDto) {
    const meal = await this.meal.createWithItems(
      callerId,
      patientId,
      {
        kind: MealKind.DAILY,
        mealType: dto.mealType,
        time: dto.time,
        observations: dto.observations,
      },
      dto.items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
      })),
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

  private buildDraft(
    extracted: AssistantExtractedMeal,
    items: ResolvedItem[],
  ): MealDraft {
    const draftItems = items.map((item) => {
      const food = item.food!;
      const ratio = item.quantity / 100;

      return {
        foodId: food.id,
        name: food.name,
        quantity: item.quantity,
        unit: item.unit,
        calories: food.calories * ratio,
        protein: food.protein * ratio,
        carbs: food.carbs * ratio,
        fat: food.fat * ratio,
      };
    });

    const sum = (pick: (item: MealDraftItem) => number) =>
      draftItems.reduce((total, item) => total + pick(item), 0);

    return {
      name: extracted.name,
      mealType: extracted.mealType,
      time: extracted.time,
      observations: extracted.observations,
      items: draftItems,
      totals: {
        calories: sum((item) => item.calories),
        protein: sum((item) => item.protein),
        carbs: sum((item) => item.carbs),
        fat: sum((item) => item.fat),
      },
    };
  }

  /**
   * Convite pra conferir o rascunho antes de salvar.
   *
   * O item que não casou com nenhum alimento é avisado aqui: antes ele era
   * descartado em silêncio, então quem ditava três comidas recebia um card com
   * duas e um total menor sem nenhuma pista do que faltou.
   */
  private buildPreviewMessage(
    draft: MealDraft,
    missingNames: string[],
  ): string {
    const items =
      draft.items.length === 1 ? '1 item' : `${draft.items.length} itens`;

    const base = `Montei "${draft.name}" com ${items}.`;

    if (missingNames.length === 0) {
      return `${base} Dá uma conferida e me diz se pode adicionar no seu dia.`;
    }

    return `${base} Não achei ${this.joinNames(missingNames)} no meu banco, então ficou de fora do total. Dá uma conferida e me diz se pode adicionar no seu dia.`;
  }

  /** "arroz", "arroz e feijão", "arroz, feijão e ovo". */
  private joinNames(names: string[]): string {
    if (names.length === 0) return 'os alimentos que você descreveu';
    if (names.length === 1) return `"${names[0]}"`;

    const quoted = names.map((name) => `"${name}"`);
    const last = quoted.pop();
    return `${quoted.join(', ')} e ${last}`;
  }

  /** Comemoração do registro — variada pro assistente não soar robótico. */
  private buildCreatedMessage(mealName: string, itemCount: number): string {
    const openings = [
      'Prontinho!',
      'Boa!',
      'Feito!',
      'Pode deixar!',
      'Anotado!',
    ];
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
        const publicMatch = await this.findFoodMatch(
          item.name,
          item.preparation,
        );
        if (publicMatch) {
          return {
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            food: publicMatch,
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

  private async findFoodMatch(name: string, preparation: string | null) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return null;

    const match = await findPublicFoodMatch(trimmed, this.food, {
      preparation,
    });
    if (match) return match;

    const simplified = this.simplifyName(trimmed);
    if (simplified && simplified !== trimmed) {
      return findPublicFoodMatch(simplified, this.food, { preparation });
    }

    return null;
  }

  /**
   * Corta só ruído de rótulo. Preparação (`grelhado`, `frito`, `assado`) ficou
   * de fora da lista de propósito: ela é o sinal que decide entre o alimento
   * cru e o cozido, e removê-la aqui desfazia o trabalho da extração.
   */
  private simplifyName(name: string): string | null {
    const stopwords = [
      'natural',
      'morno',
      'gelado',
      'quente',
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

  private currentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}
