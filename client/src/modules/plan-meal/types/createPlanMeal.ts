import { z } from 'zod'

export const createPlanMealSchema = z.object({
  name: z.string().min(1, 'Nome da refeição obrigatório').max(200),
  type: z.string().optional(),
  date: z.string().optional(),
})

export type CreatePlanMealData = z.infer<typeof createPlanMealSchema>
