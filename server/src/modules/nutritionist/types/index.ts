import { Nutritionist } from '@prisma/client';

export type NutritionistPublic = Pick<Nutritionist, 'id' | 'code' | 'createdAt'>;

export const nutritionistSelect = {
  id: true,
  code: true,
  createdAt: true,
} as const;
