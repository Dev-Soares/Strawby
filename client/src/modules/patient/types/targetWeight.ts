import { z } from 'zod'

export const targetWeightSchema = z.object({
  targetWeight: z
    .number({ error: 'Informe o peso desejado' })
    .min(30, 'Mínimo 30 kg')
    .max(300, 'Máximo 300 kg'),
})

export type TargetWeightFormData = z.infer<typeof targetWeightSchema>
