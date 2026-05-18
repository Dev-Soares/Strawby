import { PrivateFood } from '@prisma/client';

export type PrivateFoodPublic = Pick<
  PrivateFood,
  | 'id'
  | 'name'
  | 'calories'
  | 'protein'
  | 'carbs'
  | 'fat'
  | 'fiber'
  | 'sodium'
  | 'servingSize'
  | 'createdAt'
>;

export const privateFoodSelect = {
  id: true,
  name: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sodium: true,
  servingSize: true,
  createdAt: true,
} as const;
