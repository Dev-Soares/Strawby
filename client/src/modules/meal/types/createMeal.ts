import { z } from 'zod'

export const createMealSchema = z.object({
  mealType: z.string().min(1, 'Selecione o tipo de refeição'),
  time: z.string().optional(),
  date: z.string().optional(),
})

export type CreateMealData = z.infer<typeof createMealSchema>

export type CreateMealPayload = CreateMealData & {
  name: string
}
