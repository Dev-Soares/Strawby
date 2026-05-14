import { z } from 'zod'

export const planSchema = z.object({
  calories: z
    .number({ error: 'Informe um valor' })
    .min(1000, 'Mínimo 1000 kcal')
    .max(5000, 'Máximo 5000 kcal'),
  protein: z.number({ error: 'Informe um valor' }).min(0).max(500),
  carbs: z.number({ error: 'Informe um valor' }).min(0).max(800),
  fat: z.number({ error: 'Informe um valor' }).min(0).max(300),
})

export type PlanData = z.infer<typeof planSchema>
