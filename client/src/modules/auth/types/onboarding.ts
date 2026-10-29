import { z } from 'zod'

const MEASURES = {
  weight: {
    min: 30,
    max: 300,
    required: 'Informe o peso',
    range: 'O peso deve estar entre 30 e 300 kg',
  },
  height: {
    min: 100,
    max: 250,
    required: 'Informe a altura',
    range: 'A altura deve estar entre 100 e 250 cm',
  },
  targetWeight: {
    min: 30,
    max: 300,
    required: 'Informe o peso desejado',
    range: 'O peso desejado deve estar entre 30 e 300 kg',
  },
} as const

const MIN_AGE = 10
const MAX_AGE = 120

// Campo vazio em <input type="number"> chega como NaN — normaliza para undefined
// para que a obrigatoriedade seja tratada no superRefine (mensagem em pt-BR).
const numberField = z
  .union([z.number(), z.nan(), z.undefined()])
  .transform((val) => (typeof val === 'number' && !isNaN(val) ? val : undefined))

const dateField = z
  .union([z.string(), z.undefined()])
  .transform((val) => (val ? val : undefined))

const getAge = (birthDate: Date) => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export const onboardingSchema = z
  .object({
    role: z.enum(['patient', 'nutritionist'], { error: 'Selecione um perfil' }),
    acceptTerms: z.literal(true, { error: 'Você deve aceitar os termos para continuar' }),
    weight: numberField,
    height: numberField,
    targetWeight: numberField,
    birthDate: dateField,
    gender: z.enum(['male', 'female'], { error: 'Selecione o sexo' }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== 'patient') return

    for (const field of ['weight', 'height', 'targetWeight'] as const) {
      const value = data[field]
      const { min, max, required, range } = MEASURES[field]

      if (value === undefined) {
        ctx.addIssue({ code: 'custom', message: required, path: [field] })
      } else if (value < min || value > max) {
        ctx.addIssue({ code: 'custom', message: range, path: [field] })
      }
    }

    if (!data.gender) {
      ctx.addIssue({ code: 'custom', message: 'Selecione o sexo', path: ['gender'] })
    }

    if (!data.birthDate) {
      ctx.addIssue({ code: 'custom', message: 'Informe a data de nascimento', path: ['birthDate'] })
      return
    }

    const birthDate = new Date(`${data.birthDate}T00:00:00`)

    if (isNaN(birthDate.getTime())) {
      ctx.addIssue({ code: 'custom', message: 'Data de nascimento inválida', path: ['birthDate'] })
      return
    }

    const age = getAge(birthDate)

    if (age < 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'A data de nascimento não pode ser futura',
        path: ['birthDate'],
      })
    } else if (age < MIN_AGE || age > MAX_AGE) {
      ctx.addIssue({
        code: 'custom',
        message: `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`,
        path: ['birthDate'],
      })
    }
  })

export type OnboardingData = z.infer<typeof onboardingSchema>
