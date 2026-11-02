import { z } from 'zod'

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
])

export type SubstitutionGoal = z.infer<typeof substitutionGoalSchema>

export const substitutionGoalValues = substitutionGoalSchema.options

export const suggestSubstitutionSchema = z.object({
  foodName: z.string().min(1, 'Informe o alimento'),
  goal: substitutionGoalSchema,
  maxResults: z.number().min(1).max(5).optional(),
})

export type SuggestSubstitutionData = z.infer<typeof suggestSubstitutionSchema>

export type SubstituteFood = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type SubstitutionSuggestion = {
  foodName: string
  reason: string
  food: SubstituteFood | null
}

export type SuggestSubstitutionResponse = {
  substitutions: SubstitutionSuggestion[]
}
