import { z } from 'zod'

const HEIGHT_MIN = 100
const HEIGHT_MAX = 250

// Campo vazio em input numérico chega como NaN — normaliza para undefined antes
// de validar a faixa, senão o zod rejeita o NaN com a mensagem padrão em inglês.
const optionalHeight = z
  .union([z.number(), z.nan(), z.undefined()])
  .transform((val) => (typeof val === 'number' && !isNaN(val) ? val : undefined))
  .refine(
    (val) => val === undefined || (val >= HEIGHT_MIN && val <= HEIGHT_MAX),
    `A altura deve estar entre ${HEIGHT_MIN} e ${HEIGHT_MAX} cm`,
  )

export const patientBodySchema = z.object({
  height: optionalHeight,
  birthDate: z.string().date('Data de nascimento inválida').optional(),
  gender: z.enum(['male', 'female'], { error: 'Selecione o sexo' }).optional(),
})

export type PatientBodyData = z.infer<typeof patientBodySchema>
