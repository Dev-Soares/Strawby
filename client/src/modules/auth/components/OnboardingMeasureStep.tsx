import type { ChangeEvent, ReactNode } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import { clampNumericValue } from '@/shared/utils/clampNumericValue'
import type { OnboardingData } from '../types/onboarding'

type MeasureField = 'weight' | 'height' | 'targetWeight'

interface OnboardingMeasureStepProps {
  field: MeasureField
  unit: string
  placeholder: string
  /** Casas decimais aceitas: peso 1, altura 0. */
  maxDecimals: number
  register: UseFormRegister<OnboardingData>
  /** Avisado a cada digitação — usado para apagar o erro do passo. */
  onEdit?: () => void
  /** Dica logo abaixo do campo (ex: direção da meta). */
  children?: ReactNode
}

/**
 * Campo numérico protagonista — um número gigante no meio da tela.
 * O texto é cortado enquanto o usuário digita, antes de chegar ao formulário.
 */
export default function OnboardingMeasureStep({
  field,
  unit,
  placeholder,
  maxDecimals,
  register,
  onEdit,
  children,
}: OnboardingMeasureStepProps) {
  const { onChange, ...rest } = register(field, { valueAsNumber: true })

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline gap-2">
        <input
          {...rest}
          type="text"
          inputMode={maxDecimals > 0 ? 'decimal' : 'numeric'}
          autoFocus
          autoComplete="off"
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            event.target.value = clampNumericValue(event.target.value, { maxDecimals })
            onEdit?.()
            return onChange(event)
          }}
          className="w-[3.4em] bg-transparent text-center text-6xl font-black tabular-nums text-neutral-900 caret-red-500 placeholder-neutral-200 focus:outline-none dark:text-neutral-50 dark:placeholder-neutral-800 sm:text-7xl"
        />
        <span className="text-2xl font-black text-neutral-300 dark:text-neutral-600">{unit}</span>
      </div>

      <div className="mt-1 h-1 w-44 rounded-full bg-neutral-200 dark:bg-neutral-800" />

      {children}
    </div>
  )
}
