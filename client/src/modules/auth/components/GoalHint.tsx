import { TrendDown, TrendUp, Minus } from '@phosphor-icons/react'
import { deriveWeightGoal } from '../../../shared/utils/deriveWeightGoal'

export default function GoalHint({ weight, target }: { weight?: number; target?: number }) {
  const ready =
    typeof weight === 'number' && !isNaN(weight) &&
    typeof target === 'number' && !isNaN(target)

  if (!ready) {
    return (
      <p className="mt-4 text-[13px] font-semibold text-white/50">
        Digite seu peso ideal
      </p>
    )
  }

  const { direction, absDiff } = deriveWeightGoal(weight, target)

  const hint =
    direction === 'maintain'
      ? { Icon: Minus, label: 'Manter o peso' }
      : direction === 'lose'
        ? { Icon: TrendDown, label: `Perder ${absDiff.toFixed(1)} kg` }
        : { Icon: TrendUp, label: `Ganhar ${absDiff.toFixed(1)} kg` }

  return (
    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-bold text-white">
      <hint.Icon size={15} weight="bold" />
      {hint.label}
    </span>
  )
}
