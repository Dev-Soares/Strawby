import { z } from 'zod'

const requiredNumber = (min: number, max: number, msg: string) =>
  z.number().optional()
    .transform(val => (val !== undefined && isNaN(val) ? undefined : val))
    .pipe(z.number({ error: msg }).min(min).max(max))

export const onboardingSchema = z
  .object({
    role: z.enum(['patient', 'nutritionist'], { error: 'Selecione um perfil' }),
    weight: requiredNumber(30, 300, 'Informe o peso').optional(),
    height: requiredNumber(100, 250, 'Informe a altura').optional(),
    age: requiredNumber(10, 120, 'Informe a idade').optional(),
    gender: z.enum(['male', 'female'], { error: 'Selecione o sexo' }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== 'patient') return
    if (data.weight === undefined)
      ctx.addIssue({ code: 'custom', message: 'Informe o peso', path: ['weight'] })
    if (data.height === undefined)
      ctx.addIssue({ code: 'custom', message: 'Informe a altura', path: ['height'] })
    if (data.age === undefined)
      ctx.addIssue({ code: 'custom', message: 'Informe a idade', path: ['age'] })
    if (data.gender === undefined)
      ctx.addIssue({ code: 'custom', message: 'Selecione o sexo', path: ['gender'] })
  })

export type OnboardingData = z.infer<typeof onboardingSchema>
