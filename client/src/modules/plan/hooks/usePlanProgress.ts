import { useGetPlan } from './useGetPlan'
import { useGetPlanMeals } from '../../meal/hooks/useGetPlanMeals'
import type { PlanProgressKey, PlanProgressRow } from '../types/planProgress'
import { NUTRIENTS } from '@/shared/config/macros'

// Cor vem das CSS vars (`--macro-*`), não do hex do config: as vars trocam de
// tom no tema escuro, o hex é sempre o tom claro.
const config: Array<Pick<PlanProgressRow, 'key' | 'label' | 'icon' | 'unit' | 'color' | 'trackColor'>> =
  NUTRIENTS.map(({ field, label, icon, unit }) => ({
    key: field as PlanProgressKey,
    label,
    icon,
    unit,
    color: `var(--macro-${field})`,
    trackColor: `var(--macro-${field}-light)`,
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
