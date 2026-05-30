import { FoodItem, Recipe } from '@prisma/client';

export type FoodItemPublic = Pick<FoodItem, 'id' | 'quantity' | 'calories' | 'protein' | 'carbs' | 'fat'> & {
  food: { id: string; name: string } | null;
  privateFood: { id: string; name: string } | null;
};

export type RecipeTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type RecipePublic = Pick<Recipe, 'id' | 'name' | 'patientId' | 'createdAt' | 'updatedAt'> & {
  items: FoodItemPublic[];
  totals: RecipeTotals;
};

export type RecipeSummary = Pick<Recipe, 'id' | 'name' | 'patientId'> & {
  totals: RecipeTotals;
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

export const recipeSelect = {
  id: true,
  name: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
  items: { select: foodItemSelect },
} as const;
