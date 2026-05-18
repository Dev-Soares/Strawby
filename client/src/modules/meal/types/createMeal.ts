import { z } from 'zod'

export const createMealSchema = z.object({
  kind: z.enum(['DAILY', 'PLAN']),
  mealType: z.string().min(1, 'Selecione o tipo de refeição'),
  time: z.string().optional(),
  date: z.string().optional(),
})

export type CreateMealData = z.infer<typeof createMealSchema>
