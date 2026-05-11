import { PlanMeal, PlanMealItem } from '@prisma/prisma/client';

export type PlanMealItemWithFood = Pick<PlanMealItem, 'id' | 'quantity'> & {
  food: { id: string; name: string; calories: number; protein: number; carbs: number; fat: number };
};

export type PlanMealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type PlanMealPublic = Pick<PlanMeal, 'id' | 'name' | 'date' | 'userId'> & {
  items: PlanMealItemWithFood[];
  totals: PlanMealTotals;
};

export type PlanMealSummary = Pick<PlanMeal, 'id' | 'name' | 'date' | 'userId'> & {
  totals: PlanMealTotals;
};

export const planMealItemSelect = {
  id: true,
  quantity: true,
  food: {
    select: {
      id: true,
      name: true,
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
    },
  },
} as const;
