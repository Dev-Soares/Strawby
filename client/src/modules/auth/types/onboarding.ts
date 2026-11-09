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

/**
 * Faixa validada no próprio campo, não no `superRefine` do objeto.
 *
 * O `superRefine` só roda depois do objeto inteiro passar, e `acceptTerms` só é
 * marcado no último passo — até lá nenhuma regra de lá seria executada, e o
 * passo da altura liberaria qualquer número.
 *
 * Campo vazio em `<input type="number">` chega como NaN: vira `undefined` aqui
 * para a obrigatoriedade ficar com o `superRefine`, que sabe o perfil.
 */
const measureField = ({ min, max, range }: { min: number; max: number; range: string }) =>
  z
    .union([z.number(), z.nan(), z.undefined()])
    .transform((val) => (typeof val === 'number' && !isNaN(val) ? val : undefined))
    .refine((val) => val === undefined || (val >= min && val <= max), { message: range })

const getAge = (birthDate: Date) => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

/** Mesma razão do `measureField`: a idade precisa valer já no passo da data. */
const birthDateField = z
  .union([z.string(), z.undefined()])
  .transform((val) => (val ? val : undefined))
  .superRefine((val, ctx) => {
    if (!val) return

    const birthDate = new Date(`${val}T00:00:00`)

    if (isNaN(birthDate.getTime())) {
      ctx.addIssue({ code: 'custom', message: 'Data de nascimento inválida' })
      return
    }

    const age = getAge(birthDate)

    if (age < 0) {
      ctx.addIssue({ code: 'custom', message: 'A data de nascimento não pode ser futura' })
    } else if (age < MIN_AGE || age > MAX_AGE) {
      ctx.addIssue({
        code: 'custom',
        message: `A idade deve estar entre ${MIN_AGE} e ${MAX_AGE} anos`,
      })
    }
  })

export const onboardingSchema = z
  .object({
    role: z.enum(['patient', 'nutritionist'], { error: 'Selecione um perfil' }),
    acceptTerms: z.literal(true, { error: 'Você deve aceitar os termos para continuar' }),
    weight: measureField(MEASURES.weight),
    height: measureField(MEASURES.height),
    targetWeight: measureField(MEASURES.targetWeight),
    birthDate: birthDateField,
    gender: z.enum(['male', 'female'], { error: 'Selecione o sexo' }).optional(),
  })
  // só a obrigatoriedade mora aqui: ela depende do perfil escolhido
  .superRefine((data, ctx) => {
    if (data.role !== 'patient') return

    for (const field of ['weight', 'height', 'targetWeight'] as const) {
      if (data[field] === undefined) {
        ctx.addIssue({ code: 'custom', message: MEASURES[field].required, path: [field] })
      }
    }

    if (!data.gender) {
      ctx.addIssue({ code: 'custom', message: 'Selecione o sexo', path: ['gender'] })
    }

    if (!data.birthDate) {
      ctx.addIssue({ code: 'custom', message: 'Informe a data de nascimento', path: ['birthDate'] })
    }
  })

export type OnboardingData = z.infer<typeof onboardingSchema>
