import { z } from 'zod'

export const manualPlanSchema = z.object({
  calories: z
    .number({ error: 'Informe um valor' })
    .min(1000, 'Mínimo 1000 kcal')
    .max(5000, 'Máximo 5000 kcal'),
  protein: z.number({ error: 'Informe um valor' }).min(0, 'Mínimo 0 g').max(500, 'Máximo 500 g'),
  carbs: z.number({ error: 'Informe um valor' }).min(0, 'Mínimo 0 g').max(800, 'Máximo 800 g'),
  fat: z.number({ error: 'Informe um valor' }).min(0, 'Mínimo 0 g').max(300, 'Máximo 300 g'),
})

export type ManualPlanData = z.infer<typeof manualPlanSchema>

export const generatePlanSchema = z.object({
  movementLevel: z.number().min(1.15).max(1.6),
})

export type GeneratePlanData = z.infer<typeof generatePlanSchema>

export type CreatePlanData = ManualPlanData | GeneratePlanData
