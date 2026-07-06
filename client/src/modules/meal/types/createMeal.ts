import { z } from 'zod'

export const createMealSchema = z.object({
  kind: z.enum(['DAILY', 'PLAN']),
  mealType: z.string().min(1, 'Selecione o tipo de refeição'),
  time: z.string().optional(),
  date: z.string().optional(),
  observations: z.string().max(1000, 'Máximo de 1000 caracteres').optional(),
})

export type CreateMealData = z.infer<typeof createMealSchema>
