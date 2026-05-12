import { Food } from '@prisma/prisma/client';

export type FoodPublic = Pick<
  Food,
  'id' | 'name' | 'source' | 'priority' | 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber' | 'sodium'
>;

export const foodSelect = {
  id: true,
  name: true,
  source: true,
  priority: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sodium: true,
} as const;
