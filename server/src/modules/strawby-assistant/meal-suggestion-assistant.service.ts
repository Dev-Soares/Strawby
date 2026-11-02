import { Injectable, NotFoundException } from '@nestjs/common';
import { MealKind } from '@prisma/client';
import { PatientAccessService } from '../patient-access/patient-access.service';
import { FoodService } from '../food/food.service';
import { MealService } from '../meal/meal.service';
import { PlanService } from '../plan/plan.service';
import { todayInAppTz, appTimeHHmm } from '../../common/utils/date.util';
import { findPublicFoodMatch } from './utils/food-matching.util';
import type { MealMacros, MealPublic } from '../meal/types';
import { SuggestSnackDto } from './dto/suggest-snack.dto';
import { AddSuggestedMealDto } from './dto/add-suggested-meal.dto';
import { SUGGESTED_MEALS } from './data/suggested-meals.data';
import type { SuggestedMeal, SuggestedMealItem } from './data/suggested-meals.data';

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

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sumMacros = (items: { calories: number; protein: number; carbs: number; fat: number }[]): MealMacros =>
  items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

@Injectable()
export class MealSuggestionAssistantService {
  constructor(
    private readonly meal: MealService,
    private readonly plan: PlanService,
    private readonly food: FoodService,
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
    const [consumed, plan] = await Promise.all([
      this.meal.queryDayMacros(patientId, day),
      this.plan.queryPlanByPatient(patientId),
    ]);

    const remaining = plan
      ? {
          calories: Math.max(0, plan.calories - consumed.calories),
          protein: Math.max(0, plan.protein - consumed.protein),
          carbs: Math.max(0, plan.carbs - consumed.carbs),
          fat: Math.max(0, plan.fat - consumed.fat),
        }
      : null;

    const options = this.selectOptions(
      dto.mealType ?? 'snack',
      dto.maxResults ?? 3,
      remaining,
    );

    return { remaining, options };
  }

  async addSuggestedMeal(
    callerId: string,
    patientId: string,
    dto: AddSuggestedMealDto,
  ): Promise<MealPublic> {
    await this.patientAccess.resolve(callerId, patientId);

    const meal = this.findSuggestedMeal(dto.mealType, dto.mealName);
    if (!meal) {
      throw new NotFoundException('Refeição sugerida não encontrada');
    }

    const items = await this.resolveItems(meal.items);

    return this.meal.createWithItems(callerId, patientId, {
      kind: MealKind.DAILY,
      mealType: dto.mealType,
      date: todayInAppTz(),
      time: appTimeHHmm(),
    }, items);
  }

  private findSuggestedMeal(
    mealType: string,
    mealName: string,
  ): SuggestedMeal | undefined {
    const candidates = SUGGESTED_MEALS[mealType as keyof typeof SUGGESTED_MEALS] ?? [];
    return candidates.find((candidate) => candidate.name === mealName);
  }

  private async resolveItems(
    items: SuggestedMealItem[],
  ): Promise<{ foodId: string; quantity: number }[]> {
    const resolved = await Promise.all(
      items.map(async (item) => {
        const food = await findPublicFoodMatch(item.name, this.food);
        if (!food) {
          throw new NotFoundException(`Alimento não encontrado: ${item.name}`);
        }
        return { foodId: food.id, quantity: item.quantity };
      }),
    );
    return resolved;
  }

  private selectOptions(
    mealType: string,
    maxResults: number,
    remaining: MealMacros | null,
  ): SuggestedSnackResult[] {
    const candidates = SUGGESTED_MEALS[mealType as keyof typeof SUGGESTED_MEALS] ?? [];
    const mapped = candidates.map((candidate) => this.mapMeal(candidate));

    if (!remaining) {
      return shuffle(mapped).slice(0, maxResults);
    }

    const validOptions = mapped.filter((option) =>
      this.fitsWithinMacros(option.totals, remaining),
    );

    return shuffle(validOptions.length > 0 ? validOptions : mapped).slice(0, maxResults);
  }

  private mapMeal(meal: SuggestedMeal): SuggestedSnackResult {
    const items = meal.items.map((item) => this.mapItem(item));

    return {
      name: meal.name,
      mealType: meal.mealType,
      reason: meal.reason,
      items,
      totals: sumMacros(items),
    };
  }

  private mapItem(item: SuggestedMealItem): SuggestedSnackItemResult {
    return {
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      foodId: `suggested-${slugify(item.name)}`,
      foodName: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
    };
  }

  private fitsWithinMacros(totals: MealMacros, remaining: MealMacros): boolean {
    return (
      totals.calories <= remaining.calories * 1.3 &&
      totals.protein <= remaining.protein * 1.4 &&
      totals.carbs <= remaining.carbs * 1.4 &&
      totals.fat <= remaining.fat * 1.4
    );
  }
}
