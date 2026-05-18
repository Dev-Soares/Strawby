import { PrivateFood } from '@prisma/client';

export type PrivateFoodPublic = Pick<
  PrivateFood,
  | 'id'
  | 'name'
  | 'calories'
  | 'protein'
  | 'carbs'
  | 'fat'
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
  servingSize: true,
  createdAt: true,
} as const;
