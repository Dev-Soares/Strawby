import type { MascotAction } from '@/shared/types/mascotAction'
import type { OnboardingData } from '../types/onboarding'

/** Uma pergunta por tela — o mascote conduz o fluxo passo a passo. */
export const ONBOARDING_STEP_IDS = [
  'role',
  'gender',
  'birthDate',
  'height',
  'weight',
  'targetWeight',
  'terms',
] as const

export type OnboardingStepId = (typeof ONBOARDING_STEP_IDS)[number]

type OnboardingStep = {
  /** Fala do mascote enquanto a pergunta está na tela. */
  prompt: string
  /** Animação do mascote enquanto a pergunta está na tela. */
  action: MascotAction
  /** Campos validados antes de liberar o próximo passo. */
  fields: (keyof OnboardingData)[]
  /** Texto do botão principal. */
  cta?: string
}

export const ONBOARDING_STEPS: Record<OnboardingStepId, OnboardingStep> = {
  role: {
    prompt: 'Oi! Eu sou o Strawby. Como você quer usar o app?',
    action: 'happy',
    fields: ['role'],
  },
  gender: {
    prompt: 'Qual é o seu sexo biológico? Uso isso pra calcular suas calorias.',
    action: 'idle',
    fields: ['gender'],
  },
  birthDate: {
    prompt: 'Quando você nasceu?',
    action: 'thinking',
    fields: ['birthDate'],
  },
  height: {
    prompt: 'Qual é a sua altura?',
    action: 'idle',
    fields: ['height'],
  },
  weight: {
    prompt: 'E quanto você pesa hoje?',
    action: 'idle',
    fields: ['weight'],
  },
  targetWeight: {
    prompt: 'Agora o mais importante: qual peso você quer alcançar?',
    action: 'thinking',
    fields: ['targetWeight'],
  },
  terms: {
    prompt: 'Tudo pronto! Só falta aceitar os termos pra gente começar.',
    action: 'celebrate',
    fields: ['acceptTerms'],
    cta: 'Começar',
  },
}

/** Nutricionista não informa corpo nem meta de peso. */
export const ONBOARDING_FLOW: Record<'patient' | 'nutritionist', OnboardingStepId[]> = {
  patient: ['role', 'gender', 'birthDate', 'height', 'weight', 'targetWeight', 'terms'],
  nutritionist: ['role', 'terms'],
}

/** Reação do mascote quando a validação do passo falha. */
export const ONBOARDING_ERROR_ACTION: MascotAction = 'upset'

/** Reação do mascote quando o usuário responde a pergunta. */
export const ONBOARDING_ANSWER_ACTION: MascotAction = 'happy'

/**
 * Comemoração fica reservada para o aceite dos termos — o último passo.
 * Usar em toda resposta esvazia o gesto.
 */
export const ONBOARDING_FINAL_ACTION: MascotAction = 'celebrate'
