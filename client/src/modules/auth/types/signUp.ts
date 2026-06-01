import { z } from 'zod'

const requiredNumber = (min: number, max: number, msg: string) =>
  z.number().optional()
    .transform(val => (val !== undefined && isNaN(val) ? undefined : val))
    .pipe(z.number({ error: msg }).min(min).max(max))

export const signUpSchema = z
  .object({
    role: z.enum(['patient', 'nutritionist'], { error: 'Selecione um perfil' }),
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
    acceptTerms: z.literal(true, { error: 'Você deve aceitar os termos para continuar' }),
    weight: requiredNumber(30, 300, 'Informe o peso').optional(),
    height: requiredNumber(100, 250, 'Informe a altura').optional(),
    age: requiredNumber(10, 120, 'Informe a idade').optional(),
    gender: z.enum(['male', 'female'], { error: 'Selecione o sexo' }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
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

export type SignUpData = z.infer<typeof signUpSchema>
