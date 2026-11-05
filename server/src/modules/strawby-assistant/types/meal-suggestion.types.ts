import { z } from 'zod';

export const mealTypeSchema = z.enum([
  'breakfast',
  'lunch',
  'snack',
  'dinner',
  'supper',
]);

export type MealType = z.infer<typeof mealTypeSchema>;

export const mealTypeValues = mealTypeSchema.options;
