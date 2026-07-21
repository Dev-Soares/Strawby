export type WeightGoalDirection = 'lose' | 'gain' | 'maintain'

export interface WeightGoal {
  direction: WeightGoalDirection
  /** target - current, kg. Positive means target is above current. */
  diff: number
  /** Math.abs(diff), kg. */
  absDiff: number
}

/**
 * Deriva o objetivo (perder/ganhar/manter) do peso atual vs meta.
 * Usa uma banda de ±1kg: diferenças dentro dessa banda são tratadas como "manter".
 */
export function deriveWeightGoal(current: number, target: number): WeightGoal {
  const diff = target - current
  const absDiff = Math.abs(diff)
  const direction: WeightGoalDirection = absDiff <= 1 ? 'maintain' : diff < 0 ? 'lose' : 'gain'
  return { direction, diff, absDiff }
}
