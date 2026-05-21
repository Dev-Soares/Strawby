import { Plan } from '@prisma/client';

export type PlanMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type PlanPublic = Pick<Plan, 'id' | 'calories' | 'protein' | 'carbs' | 'fat' | 'userId'>;

export const planSelect = {
  id: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  userId: true,
} as const;
