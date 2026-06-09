import { z } from 'zod'

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, 'Código deve ter 6 dígitos')
    .regex(/^\d{6}$/, 'Código deve conter apenas números'),
})

export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
