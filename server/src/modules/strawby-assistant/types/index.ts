import { z } from 'zod';

const mealTypeSchema = z.enum([
  'breakfast',
  'lunch',
  'snack',
  'dinner',
  'supper',
]);

export const assistantExtractedItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
});

export const assistantExtractedMealSchema = z.object({
  name: z.string().min(1),
  mealType: mealTypeSchema.nullable(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable(),
  observations: z.string().nullable(),
  items: z.array(assistantExtractedItemSchema).min(1),
});

export type AssistantExtractedItem = z.infer<
  typeof assistantExtractedItemSchema
>;

export type AssistantExtractedMeal = z.infer<
  typeof assistantExtractedMealSchema
>;
