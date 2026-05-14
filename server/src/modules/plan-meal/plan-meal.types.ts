import { PlanMeal, PlanMealItem } from '@prisma/client';

export type PlanMealItemWithFood = Pick<PlanMealItem, 'id' | 'quantity' | 'calories' | 'protein' | 'carbs' | 'fat'> & {
  food: { id: string; name: string };
};

export type PlanMealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type PlanMealPublic = Pick<PlanMeal, 'id' | 'name' | 'type' | 'date' | 'userId'> & {
  items: PlanMealItemWithFood[];
  totals: PlanMealTotals;
};

export type PlanMealSummary = Pick<PlanMeal, 'id' | 'name' | 'type' | 'date' | 'userId'> & {
  totals: PlanMealTotals;
};

export const planMealItemSelect = {
  id: true,
  quantity: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  food: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;
