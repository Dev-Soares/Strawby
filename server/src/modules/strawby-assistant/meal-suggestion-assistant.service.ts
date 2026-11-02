import { Injectable } from '@nestjs/common';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { AiService } from '../ai/ai.service';
import { FoodService } from '../food/food.service';
import { MealService } from '../meal/meal.service';
import { PlanService } from '../plan/plan.service';
import { todayInAppTz } from '../../common/utils/date.util';
import { findPublicFoodMatch } from './utils/food-matching.util';
import type { MealMacros, MealPublic } from '../meal/types';
import { SuggestSnackDto } from './dto/suggest-snack.dto';
import {
  buildSnackSuggestionPrompt,
  SNACK_SUGGESTION_SYSTEM_PROMPT,
} from './prompts/meal-suggestion.prompts';
import { suggestedSnackListSchema } from './types/meal-suggestion.types';

type SuggestedSnackItemResult = {
  name: string;
  quantity: number;
  unit: string;
  foodId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type SuggestedSnackResult = {
  name: string;
  mealType: string;
  reason: string;
  items: SuggestedSnackItemResult[];
  totals: MealMacros;
};

@Injectable()
export class MealSuggestionAssistantService {
  constructor(
    private readonly ai: AiService,
    private readonly food: FoodService,
    private readonly meal: MealService,
    private readonly plan: PlanService,
    private readonly patientAccess: PatientAccessService,
  ) {}

  async suggestSnack(
    callerId: string,
    patientId: string,
    dto: SuggestSnackDto,
  ): Promise<{
    remaining: MealMacros | null;
    options: SuggestedSnackResult[];
  }> {
    await this.patientAccess.resolve(callerId, patientId);

    const day = todayInAppTz();
    const [meals, plan] = await Promise.all([
      this.meal.queryMealsByDay(patientId, day),
      this.plan.queryPlanByPatient(patientId),
    ]);

    const consumed = this.reduceDayMacros(meals);
    const remaining = plan
      ? {
          calories: Math.max(0, plan.calories - consumed.calories),
          protein: Math.max(0, plan.protein - consumed.protein),
          carbs: Math.max(0, plan.carbs - consumed.carbs),
          fat: Math.max(0, plan.fat - consumed.fat),
        }
      : null;

    const maxResults = dto.maxResults ?? 3;

    const extracted = await this.ai.generateObject({
      system: SNACK_SUGGESTION_SYSTEM_PROMPT,
      prompt: buildSnackSuggestionPrompt(remaining, dto.mealType, maxResults),
      schema: suggestedSnackListSchema,
      temperature: 0.4,
    });

    const options = await this.resolveOptions(extracted.options, maxResults);

    return { remaining, options };
  }

  private reduceDayMacros(meals: MealPublic[]): MealMacros {
    if (!meals?.length) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totals.calories,
        protein: acc.protein + meal.totals.protein,
        carbs: acc.carbs + meal.totals.carbs,
        fat: acc.fat + meal.totals.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  private async resolveOptions(
    candidates: {
      name: string;
      mealType: string;
      reason: string;
      items: { name: string; quantity: number; unit: string }[];
    }[],
    maxResults: number,
  ): Promise<SuggestedSnackResult[]> {
    const limited = candidates.slice(0, maxResults);

    return Promise.all(
      limited.map(async (candidate) => {
        const itemResults = await Promise.all(
          candidate.items.map(async (item) => {
            const match = await findPublicFoodMatch(item.name, this.food);
            if (!match) return null;

            const ratio = item.quantity / 100;
            return {
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              foodId: match.id,
              foodName: match.name,
              calories: match.calories * ratio,
              protein: match.protein * ratio,
              carbs: match.carbs * ratio,
              fat: match.fat * ratio,
            };
          }),
        );

        const validItems = itemResults.filter(
          (item): item is SuggestedSnackItemResult => item !== null,
        );

        const totals = validItems.reduce(
          (acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        );

        return {
          name: candidate.name,
          mealType: candidate.mealType,
          reason: candidate.reason,
          items: validItems,
          totals,
        };
      }),
    );
  }
}
