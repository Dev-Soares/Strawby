import { z } from 'zod'

export const weightRecordSchema = z.object({
  weight: z
    .number({ error: 'Informe o peso' })
    .min(30, 'Mínimo 30 kg')
    .max(300, 'Máximo 300 kg'),
})

export type WeightRecordFormData = z.infer<typeof weightRecordSchema>
