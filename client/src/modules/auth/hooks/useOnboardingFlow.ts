import { useState } from 'react'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'
import {
  ONBOARDING_ANSWER_ACTION,
  ONBOARDING_ERROR_ACTION,
  ONBOARDING_FLOW,
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from '../config/onboardingSteps'
import type { OnboardingData } from '../types/onboarding'
import { useCompleteOnboarding } from './useCompleteOnboarding'

const isFilled = (value: unknown) => typeof value === 'number' && !Number.isNaN(value)

/** O botão principal só libera quando a pergunta da tela foi respondida. */
const isAnswered = (stepId: OnboardingStepId, values: Partial<OnboardingData>): boolean => {
  switch (stepId) {
    case 'role':
      return Boolean(values.role)
    case 'gender':
      return Boolean(values.gender)
    case 'birthDate':
      return Boolean(values.birthDate)
    case 'height':
    case 'weight':
    case 'targetWeight':
      return isFilled(values[stepId])
    case 'terms':
      return values.acceptTerms === true
  }
}

type MascotTurn = {
  action: MascotAction
  playback: MascotPlayback
  /** Muda sempre que a animação precisa recomeçar do frame 0. */
  key: string
}

/**
 * Conduz o onboarding como uma conversa: uma pergunta por tela, o mascote
 * reagindo a cada resposta. A ordem dos passos depende do perfil escolhido —
 * nutricionista não informa corpo nem meta.
 */
export const useOnboardingFlow = () => {
  const form = useCompleteOnboarding()
  const { trigger, watch, setValue, clearErrors, onSubmit, isPending } = form

  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [reaction, setReaction] = useState<{ action: MascotAction; nonce: number } | null>(null)

  const values = watch()
  const flow = ONBOARDING_FLOW[values.role ?? 'patient']
  const index = Math.min(stepIndex, flow.length - 1)
  const stepId = flow[index]
  const step = ONBOARDING_STEPS[stepId]

  const isLast = index === flow.length - 1
  const isFirst = index === 0

  const react = (action: MascotAction) =>
    setReaction((prev) => ({ action, nonce: (prev?.nonce ?? 0) + 1 }))

  const goNext = async () => {
    if (isPending) return

    const valid = await trigger(step.fields)
    if (!valid) {
      react(ONBOARDING_ERROR_ACTION)
      return
    }

    if (isLast) {
      onSubmit()
      return
    }

    setReaction(null)
    setDirection(1)
    setStepIndex(index + 1)
  }

  const goBack = () => {
    if (isFirst || isPending) return
    setReaction(null)
    setDirection(-1)
    setStepIndex(index - 1)
  }

  /**
   * Mexer na resposta apaga o erro do passo e devolve o mascote à pergunta —
   * o balão não pode ficar reclamando de um valor que o usuário já corrigiu.
   */
  const clearStepError = () => {
    clearErrors(step.fields)
    setReaction(null)
  }

  const selectRole = (role: NonNullable<OnboardingData['role']>) => {
    setValue('role', role)
    clearErrors('role')
    react(ONBOARDING_ANSWER_ACTION)
  }

  const selectGender = (gender: NonNullable<OnboardingData['gender']>) => {
    setValue('gender', gender)
    clearErrors('gender')
    react(ONBOARDING_ANSWER_ACTION)
  }

  const selectBirthDate = (iso?: string) => {
    setValue('birthDate', iso)
    clearErrors('birthDate')
    // só comemora quando dia, mês e ano estão completos
    if (iso) react(ONBOARDING_ANSWER_ACTION)
  }

  const toggleTerms = () => {
    // o schema tipa o aceite como `true` — desmarcar precisa do cast
    const next = !values.acceptTerms
    setValue('acceptTerms', next as true)
    clearErrors('acceptTerms')
    if (next) react(ONBOARDING_ANSWER_ACTION)
  }

  const mascot: MascotTurn = reaction
    ? {
        action: reaction.action,
        // a decepção fica parada no último frame; o resto volta pro idle
        playback: reaction.action === ONBOARDING_ERROR_ACTION ? 'once' : 'settle',
        key: `${reaction.action}-${reaction.nonce}`,
      }
    : {
        action: step.action,
        playback: step.action === 'happy' ? 'settle' : 'loop',
        key: stepId,
      }

  return {
    ...form,
    values,
    stepId,
    step,
    stepIndex: index,
    totalSteps: flow.length,
    direction,
    isFirst,
    isLast,
    canContinue: isAnswered(stepId, values),
    goNext,
    goBack,
    clearStepError,
    selectRole,
    selectGender,
    selectBirthDate,
    toggleTerms,
    mascot,
  }
}
