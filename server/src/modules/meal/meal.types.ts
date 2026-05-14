import { Meal, MealItem } from '@prisma/client';

export type MealItemWithFood = Pick<MealItem, 'id' | 'quantity'> & {
  food: { id: string; name: string; calories: number; protein: number; carbs: number; fat: number };
};

export type MealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealPublic = Pick<Meal, 'id' | 'name' | 'date' | 'userId'> & {
  items: MealItemWithFood[];
  totals: MealTotals;
};

export type MealSummary = Pick<Meal, 'id' | 'name' | 'date' | 'userId'> & {
  totals: MealTotals;
};

export const mealItemSelect = {
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
