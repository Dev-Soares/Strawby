import { z } from 'zod'

export const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner', 'supper'] as const

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export const updateMealSchema = z.object({
  mealType: z.enum(MEAL_TYPES),
  // Vazio é permitido: refeição de plano pode não ter horário definido.
  time: z
    .string()
    .refine((value) => value === '' || TIME_REGEX.test(value), 'Horário inválido'),
  observations: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
})

export type UpdateMealData = z.infer<typeof updateMealSchema>

/** Corpo enviado à API — `time` é omitido quando não há horário. */
export type UpdateMealPayload = Omit<UpdateMealData, 'time'> & { time?: string }
