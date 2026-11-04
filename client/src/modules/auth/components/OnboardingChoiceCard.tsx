import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'

interface OnboardingChoiceCardProps {
  label: string
  description?: string
  Icon: LucideIcon
  isSelected: boolean
  onSelect: () => void
  /** `row` empilha com descrição; `tile` fica quadrado em grade. */
  layout?: 'row' | 'tile'
}

/**
 * Opção clicável do onboarding — borda grossa embaixo que afunda no clique.
 */
export default function OnboardingChoiceCard({
  label,
  description,
  Icon,
  isSelected,
  onSelect,
  layout = 'row',
}: OnboardingChoiceCardProps) {
  const state = isSelected
    ? 'border-red-500 border-b-red-500 bg-red-50 dark:bg-red-950/40'
    : 'border-neutral-200 border-b-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:border-b-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800/60'

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`group flex cursor-pointer items-center rounded-2xl border-2 border-b-4 transition-colors duration-150 active:translate-y-0.5 active:border-b-2 ${state} ${
        layout === 'tile' ? 'flex-col justify-center gap-3 px-4 py-6' : 'gap-4 px-4 py-4'
      }`}
    >
      <span
        className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl transition-colors duration-150 ${
          isSelected
            ? 'bg-red-500 text-white'
            : 'bg-neutral-100 text-neutral-400 group-hover:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500'
        }`}
      >
        <Icon size={24} strokeWidth={2.4} />
      </span>

      <span className={`min-w-0 ${layout === 'tile' ? 'text-center' : 'flex-1 text-left'}`}>
        <span
          className={`block text-[15px] font-extrabold tracking-tight ${
            isSelected
              ? 'text-red-700 dark:text-red-200'
              : 'text-neutral-800 dark:text-neutral-100'
          }`}
        >
          {label}
        </span>
        {description && (
          <span className="mt-1 block text-[12px] font-semibold leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </span>
        )}
      </span>

      {layout === 'row' && (
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
            isSelected
              ? 'border-red-500 bg-red-500 text-white'
              : 'border-neutral-200 text-transparent dark:border-neutral-700'
          }`}
        >
          <Check size={13} strokeWidth={3.4} />
        </span>
      )}
    </button>
  )
}
