import { z } from 'zod'

export const updateCodeSchema = z.object({
  code: z
    .string()
    .min(4, 'Mínimo 4 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, - e _'),
})

export type UpdateCodeData = z.infer<typeof updateCodeSchema>
