import { z } from 'zod';

export const substitutionGoalSchema = z.enum([
  'less-carbs',
  'more-protein',
  'less-calories',
  'more-fiber',
  'vegetarian',
  'vegan',
  'lower-fat',
  'lactose-free',
  'gluten-free',
]);

export type SubstitutionGoal = z.infer<typeof substitutionGoalSchema>;

export const substitutionGoalValues = substitutionGoalSchema.options;

export const foodSubstitutionSchema = z.object({
  foodName: z.string().min(1),
  reason: z.string().min(1),
});

export const foodSubstitutionListSchema = z.object({
  substitutions: z.array(foodSubstitutionSchema).min(1).max(5),
});

export type FoodSubstitution = z.infer<typeof foodSubstitutionSchema>;
export type FoodSubstitutionList = z.infer<typeof foodSubstitutionListSchema>;
