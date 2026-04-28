import { z } from 'zod'

export const planSchema = z.object({
  dailyKcal: z
    .number({ error: 'Informe um valor' })
    .min(1000, 'Mínimo 1000 kcal')
    .max(5000, 'Máximo 5000 kcal'),
  proteinG: z.number({ error: 'Informe um valor' }).min(0).max(500),
  carbsG: z.number({ error: 'Informe um valor' }).min(0).max(800),
  fatG: z.number({ error: 'Informe um valor' }).min(0).max(300),
})

export type PlanData = z.infer<typeof planSchema>
