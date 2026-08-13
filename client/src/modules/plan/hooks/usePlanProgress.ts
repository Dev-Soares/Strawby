import { useGetPlan } from './useGetPlan'
import { useGetPlanMeals } from '../../meal/hooks/useGetPlanMeals'
import type { PlanProgressKey, PlanProgressRow } from '../types/planProgress'
import { NUTRIENTS } from '@/shared/config/macros'

const config: Array<Pick<PlanProgressRow, 'key' | 'label' | 'unit' | 'color' | 'trackColor'>> =
  NUTRIENTS.map(({ field, label, unit, color, track }) => ({
    key: field as PlanProgressKey,
    label,
    unit,
    color,
    trackColor: track,
  }))

export const usePlanProgress = () => {
  const planQuery = useGetPlan()
  const mealsQuery = useGetPlanMeals()

  const plan = planQuery.data
  const meals = mealsQuery.data

  const rows: PlanProgressRow[] = plan
    ? config.map((c) => {
        const target = plan[c.key]
        const planned = meals?.reduce((acc, m) => acc + m.totals[c.key as PlanProgressKey], 0) ?? 0
        const remaining = Math.max(target - planned, 0)
        const over = planned > target
        const progress = target > 0 ? Math.min(planned / target, 1) : 0
        return { ...c, target, planned, remaining, over, progress }
      })
    : []

  return {
    rows,
    hasPlan: !!plan,
    isPending: planQuery.isPending || mealsQuery.isPending,
    isError: planQuery.isError || mealsQuery.isError,
  }
}
