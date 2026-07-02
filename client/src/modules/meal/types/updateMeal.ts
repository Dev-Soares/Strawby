import { z } from 'zod'

export const updateMealSchema = z.object({
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido'),
})

export type UpdateMealData = z.infer<typeof updateMealSchema>
