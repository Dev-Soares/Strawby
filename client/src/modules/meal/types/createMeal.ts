import { z } from 'zod'

export const createMealSchema = z.object({
  name: z.string().min(1, 'Nome da refeição obrigatório').max(200),
  kind: z.enum(['DAILY', 'PLAN']),
  mealType: z.string().optional(),
  time: z.string().optional(),
  date: z.string().optional(),
})

export type CreateMealData = z.infer<typeof createMealSchema>
