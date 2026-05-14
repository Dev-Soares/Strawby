import { Meal, MealItem } from '@prisma/client';

export type MealItemWithFood = Pick<MealItem, 'id' | 'quantity' | 'calories' | 'protein' | 'carbs' | 'fat'> & {
  food: { id: string; name: string };
};

export type MealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealPublic = Pick<Meal, 'id' | 'name' | 'mealType' | 'time' | 'date' | 'userId'> & {
  items: MealItemWithFood[];
  totals: MealTotals;
};

export type MealSummary = Pick<Meal, 'id' | 'name' | 'mealType' | 'time' | 'date' | 'userId'> & {
  totals: MealTotals;
};

export const mealItemSelect = {
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
