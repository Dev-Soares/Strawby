import { Plan } from '@prisma/client';

export type PlanMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MacroDistribution = {
  protein: number;
  carbs: number;
  fat: number;
};

export type PlanPublic = Pick<
  Plan,
  'id' | 'calories' | 'protein' | 'carbs' | 'fat' | 'source' | 'patientId'
>;

export const planSelect = {
  id: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  source: true,
  patientId: true,
} as const;
