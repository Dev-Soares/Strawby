import type { ComponentProps } from 'react'

interface StepButtonProps extends ComponentProps<'button'> {
  /** `primary` é o CTA vermelho; `secondary` é o botão neutro (voltar). */
  variant?: 'primary' | 'secondary'
}

const BASE =
  'flex cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-extrabold uppercase tracking-wide transition-colors duration-150 active:translate-y-0.5 active:border-b-2 disabled:pointer-events-none'

const VARIANT = {
  primary:
    'border-b-4 border-red-800 bg-red-600 text-white hover:bg-red-500 disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:border-neutral-800 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-600',
  secondary:
    'shrink-0 border-2 border-b-4 border-neutral-200 border-b-neutral-300 bg-white px-5 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-50 dark:border-neutral-800 dark:border-b-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200',
} as const

/** Botão dos rodapés passo a passo — mesmo peso visual no onboarding e no tutorial. */
export default function StepButton({
  variant = 'primary',
  className = '',
  ...props
}: StepButtonProps) {
  return <button {...props} className={`${BASE} ${VARIANT[variant]} ${className}`} />
}
