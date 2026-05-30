import { z } from 'zod'

export const manualPlanSchema = z.object({
  calories: z
    .number({ error: 'Informe um valor' })
    .min(1000, 'Mínimo 1000 kcal')
    .max(5000, 'Máximo 5000 kcal'),
  protein: z.number({ error: 'Informe um valor' }).min(0).max(500),
  carbs: z.number({ error: 'Informe um valor' }).min(0).max(800),
  fat: z.number({ error: 'Informe um valor' }).min(0).max(300),
})

export type ManualPlanData = z.infer<typeof manualPlanSchema>

export const generatePlanSchema = z.object({
  goal: z.enum(['lose', 'gain']),
  age: z
    .number({ error: 'Informe a idade' })
    .min(10, 'Mínimo 10 anos')
    .max(120, 'Máximo 120 anos'),
  weight: z
    .number({ error: 'Informe o peso' })
    .min(30, 'Mínimo 30 kg')
    .max(300, 'Máximo 300 kg'),
  height: z
    .number({ error: 'Informe a altura' })
    .min(100, 'Mínimo 100 cm')
    .max(250, 'Máximo 250 cm'),
  gender: z.enum(['male', 'female']),
  movementLevel: z.number().min(1.2).max(1.9),
})

export type GeneratePlanData = z.infer<typeof generatePlanSchema>

export type CreatePlanData = ManualPlanData | GeneratePlanData
