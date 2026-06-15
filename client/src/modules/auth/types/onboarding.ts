import { z } from 'zod'

const requiredNumber = (min: number, max: number, msg: string) =>
  z.number().optional()
    .transform(val => (val !== undefined && isNaN(val) ? undefined : val))
    .pipe(z.number({ error: msg }).min(min).max(max))

export const onboardingSchema = z
  .object({
    role: z.enum(['patient', 'nutritionist'], { error: 'Selecione um perfil' }),
    acceptTerms: z.literal(true, { error: 'Você deve aceitar os termos para continuar' }),
    weight: requiredNumber(30, 300, 'Informe o peso').optional(),
    height: requiredNumber(100, 250, 'Informe a altura').optional(),
    birthDate: z.string().date({ message: 'Informe a data de nascimento' }).optional(),
    gender: z.enum(['male', 'female'], { error: 'Selecione o sexo' }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== 'patient') return
    if (data.weight === undefined)
      ctx.addIssue({ code: 'custom', message: 'Informe o peso', path: ['weight'] })
    if (data.height === undefined)
      ctx.addIssue({ code: 'custom', message: 'Informe a altura', path: ['height'] })
    if (data.birthDate === undefined)
      ctx.addIssue({ code: 'custom', message: 'Informe a data de nascimento', path: ['birthDate'] })
    if (data.gender === undefined)
      ctx.addIssue({ code: 'custom', message: 'Selecione o sexo', path: ['gender'] })
  })

export type OnboardingData = z.infer<typeof onboardingSchema>
