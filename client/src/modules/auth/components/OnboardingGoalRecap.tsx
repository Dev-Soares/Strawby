import { ArrowRight } from 'lucide-react'

interface OnboardingGoalRecapProps {
  weight?: number
  target?: number
}

const format = (value?: number) =>
  typeof value === 'number' && !isNaN(value) ? value : '—'

/** Peso atual → meta, lado a lado, pra decisão não ficar no abstrato. */
export default function OnboardingGoalRecap({ weight, target }: OnboardingGoalRecapProps) {
  return (
    <div className="mt-8 flex w-full items-stretch gap-3">
      <div className="flex-1 rounded-2xl border-2 border-neutral-200 px-4 py-3.5 dark:border-neutral-800">
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Peso atual
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black leading-none tabular-nums text-neutral-800 dark:text-neutral-100">
            {format(weight)}
          </span>
          <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">kg</span>
        </div>
      </div>

      <div className="flex items-center">
        <ArrowRight size={18} strokeWidth={2.6} className="text-neutral-300 dark:text-neutral-600" />
      </div>

      <div className="flex-1 rounded-2xl border-2 border-red-500 bg-red-50 px-4 py-3.5 dark:bg-red-950/40">
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 dark:text-red-400">
          Meta
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black leading-none tabular-nums text-red-700 dark:text-red-200">
            {format(target)}
          </span>
          <span className="text-xs font-bold text-red-400">kg</span>
        </div>
      </div>
    </div>
  )
}
