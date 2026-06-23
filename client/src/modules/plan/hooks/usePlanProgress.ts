import { useGetPlan } from './useGetPlan'
import { useGetPlanMeals } from '../../meal/hooks/useGetPlanMeals'
import type { PlanProgressKey, PlanProgressRow } from '../types/planProgress'

const config: Array<Pick<PlanProgressRow, 'key' | 'label' | 'unit' | 'color' | 'trackColor'>> = [
  { key: 'calories', label: 'Calorias', unit: 'kcal', color: '#ef4444', trackColor: '#fee2e2' },
  { key: 'protein', label: 'Proteína', unit: 'g', color: '#f59e0b', trackColor: '#fef3c7' },
  { key: 'carbs', label: 'Carboidratos', unit: 'g', color: '#3b82f6', trackColor: '#dbeafe' },
  { key: 'fat', label: 'Gordura', unit: 'g', color: '#a855f7', trackColor: '#f3e8ff' },
]

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
