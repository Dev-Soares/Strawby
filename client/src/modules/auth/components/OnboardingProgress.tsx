import { motion } from 'framer-motion'

interface OnboardingProgressProps {
  /** Passo atual, começando em 0. */
  stepIndex: number
  totalSteps: number
}

export default function OnboardingProgress({ stepIndex, totalSteps }: OnboardingProgressProps) {
  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={stepIndex + 1}
        className="h-3.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
      >
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative h-full rounded-full bg-red-500"
        >
          {/* brilho no topo da barra — o detalhe que tira o ar de barra default */}
          <span className="absolute inset-x-2 top-1 h-1 rounded-full bg-white/35" />
        </motion.div>
      </div>

      <span className="w-10 shrink-0 text-right text-[13px] font-extrabold tabular-nums text-neutral-400 dark:text-neutral-500">
        {stepIndex + 1}/{totalSteps}
      </span>
    </div>
  )
}
