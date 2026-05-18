import { Meal, FoodItem } from '@prisma/client';

export type FoodItemPublic = Pick<FoodItem, 'id' | 'quantity' | 'calories' | 'protein' | 'carbs' | 'fat'> & {
  food: { id: string; name: string } | null;
  privateFood: { id: string; name: string } | null;
};

export type MealTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealPublic = Pick<Meal, 'id' | 'name' | 'kind' | 'mealType' | 'time' | 'date' | 'userId'> & {
  items: FoodItemPublic[];
  totals: MealTotals;
};

export type MealSummary = Pick<Meal, 'id' | 'name' | 'kind' | 'mealType' | 'time' | 'date' | 'userId'> & {
  totals: MealTotals;
};

export const foodItemSelect = {
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
  privateFood: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

export const mealSelect = {
  id: true,
  name: true,
  kind: true,
  mealType: true,
  time: true,
  date: true,
  userId: true,
  items: { select: foodItemSelect },
} as const;
