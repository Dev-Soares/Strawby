import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

interface OnboardingTermsStepProps {
  isAccepted: boolean
  onToggle: () => void
}

export default function OnboardingTermsStep({ isAccepted, onToggle }: OnboardingTermsStepProps) {
  return (
    <div
      role="checkbox"
      tabIndex={0}
      aria-checked={isAccepted}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key !== ' ') return
        event.preventDefault()
        onToggle()
      }}
      className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-b-4 px-4 py-4 transition-colors duration-150 focus:outline-none focus-visible:ring-3 focus-visible:ring-red-500/40 active:translate-y-0.5 active:border-b-2 ${
        isAccepted
          ? 'border-red-500 border-b-red-500 bg-red-50 dark:bg-red-950/40'
          : 'border-neutral-200 border-b-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:border-b-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800/60'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 transition-colors duration-150 ${
          isAccepted
            ? 'border-red-500 bg-red-500 text-white'
            : 'border-neutral-200 text-transparent dark:border-neutral-700'
        }`}
      >
        <Check size={16} strokeWidth={3.4} />
      </span>

      <p className="text-[13px] font-semibold leading-relaxed text-neutral-600 dark:text-neutral-300">
        Li e aceito os{' '}
        <Link
          to="/terms"
          target="_blank"
          onClick={(event) => event.stopPropagation()}
          className="font-extrabold text-red-600 underline underline-offset-2 dark:text-red-400"
        >
          Termos de Uso
        </Link>{' '}
        e a{' '}
        <Link
          to="/privacy"
          target="_blank"
          onClick={(event) => event.stopPropagation()}
          className="font-extrabold text-red-600 underline underline-offset-2 dark:text-red-400"
        >
          Política de Privacidade
        </Link>
      </p>
    </div>
  )
}
