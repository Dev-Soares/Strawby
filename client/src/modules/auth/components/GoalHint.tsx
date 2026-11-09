import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { deriveWeightGoal } from '../../../shared/utils/deriveWeightGoal'

export default function GoalHint({ weight, target }: { weight?: number; target?: number }) {
  const ready =
    typeof weight === 'number' && !isNaN(weight) &&
    typeof target === 'number' && !isNaN(target)

  if (!ready) {
    return (
      <p className="mt-5 text-[13px] font-bold text-neutral-400 dark:text-neutral-500">
        Digite seu peso ideal
      </p>
    )
  }

  const { direction, absDiff } = deriveWeightGoal(weight, target)

  const hint =
    direction === 'maintain'
      ? { Icon: Minus, label: 'Manter o peso' }
      : direction === 'lose'
        ? { Icon: TrendingDown, label: `Perder ${absDiff.toFixed(1)} kg` }
        : { Icon: TrendingUp, label: `Ganhar ${absDiff.toFixed(1)} kg` }

  return (
    <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-[13px] font-extrabold text-red-600 dark:bg-red-950/50 dark:text-red-300">
      <hint.Icon size={15} strokeWidth={2.6} />
      {hint.label}
    </span>
  )
}
