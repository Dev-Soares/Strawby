import { z } from 'zod'

export type Plan = {
  id: string
  calories: number
  protein: number
  carbs: number
  fat: number
  patientId: string
}

export const planSchema = z.object({
  calories: z
    .number({ error: 'Informe um valor' })
    .min(1000, 'Mínimo 1000 kcal')
    .max(5000, 'Máximo 5000 kcal'),
  protein: z.number({ error: 'Informe um valor' }).min(0, 'Mínimo 0 g').max(500, 'Máximo 500 g'),
  carbs: z.number({ error: 'Informe um valor' }).min(0, 'Mínimo 0 g').max(800, 'Máximo 800 g'),
  fat: z.number({ error: 'Informe um valor' }).min(0, 'Mínimo 0 g').max(300, 'Máximo 300 g'),
})

export type PlanData = z.infer<typeof planSchema>
