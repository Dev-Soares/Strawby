import { z } from 'zod';

export const assistantSearchSchema = z.object({
  queries: z.array(z.string().min(1)).min(1).max(5),
});

export type AssistantSearch = z.infer<typeof assistantSearchSchema>;

export const assistantMealItemSchema = z.object({
  foodId: z.string().uuid().optional(),
  privateFoodId: z.string().uuid().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  name: z.string().min(1),
});

export const assistantMealSchema = z.object({
  name: z.string().min(1),
  mealType: z
    .enum(['breakfast', 'lunch', 'snack', 'dinner', 'supper'])
    .optional(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  observations: z.string().optional(),
  items: z.array(assistantMealItemSchema).min(1),
});

export type AssistantMealItem = z.infer<typeof assistantMealItemSchema>;

export type AssistantMeal = z.infer<typeof assistantMealSchema>;
