import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MASCOT_DEFAULT_PLAYBACK } from '@/shared/config/mascotActions'
import type { TourStep } from '../types/tourStep'

export type TourFinishReason = 'complete' | 'skip'

/**
 * Conduz o tutorial como o onboarding: uma fala por passo, o mascote no foco.
 * Cada passo pode abrir uma rota antes de destacar o alvo.
 */
export const useTourFlow = (steps: TourStep[], onFinish: (reason: TourFinishReason) => void) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [index, setIndex] = useState(0)

  const step = steps[index]
  const isFirst = index === 0
  const isLast = index === steps.length - 1

  // cada passo é uma aba: abrir a rota é o próprio conteúdo do passo
  useEffect(() => {
    if (pathname !== step.route) navigate(step.route)
  }, [step, pathname, navigate])

  const goNext = useCallback(() => {
    if (isLast) {
      onFinish('complete')
      return
    }
    setIndex((current) => current + 1)
  }, [isLast, onFinish])

  const goBack = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0))
  }, [])

  const skip = useCallback(() => onFinish('skip'), [onFinish])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goBack()
      if (event.key === 'Escape') skip()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goBack, skip])

  return {
    step,
    stepIndex: index,
    totalSteps: steps.length,
    isFirst,
    isLast,
    goNext,
    goBack,
    skip,
    mascot: {
      action: step.action,
      playback: MASCOT_DEFAULT_PLAYBACK[step.action],
      key: step.id,
    },
  }
}
