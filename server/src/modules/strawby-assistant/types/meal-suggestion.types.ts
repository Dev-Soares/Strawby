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

export const suggestedSnackItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
});

export const suggestedSnackSchema = z.object({
  name: z.string().min(1),
  mealType: mealTypeSchema,
  reason: z.string().min(1),
  items: z.array(suggestedSnackItemSchema).min(1).max(5),
});

export const suggestedSnackListSchema = z.object({
  options: z.array(suggestedSnackSchema).min(1).max(3),
});

export type SuggestedSnackItem = z.infer<typeof suggestedSnackItemSchema>;
export type SuggestedSnack = z.infer<typeof suggestedSnackSchema>;
export type SuggestedSnackList = z.infer<typeof suggestedSnackListSchema>;
