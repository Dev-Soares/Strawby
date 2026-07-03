import { z } from 'zod'

export const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner', 'supper'] as const

export const updateMealSchema = z.object({
  mealType: z.enum(MEAL_TYPES),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido'),
})

export type UpdateMealData = z.infer<typeof updateMealSchema>
