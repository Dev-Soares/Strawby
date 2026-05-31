import { useMemo } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useGetMealsByDay } from '../../meal/hooks/useGetMealsByDay'
import { useGetPlan } from '../../plan/hooks/useGetPlan'
import { useDay } from '../../daily-summary/contexts/DayContext'
import type { DailySummary } from '../../daily-summary/types/dailySummary'

export const usePatientHome = () => {
  const { data: user } = useAuth()
  const { data: plan, isPending: planPending } = useGetPlan()
  const { selectedDay } = useDay()

  const { data: meals, isPending: mealsPending, isFetching: mealsFetching, isError: mealsError } = useGetMealsByDay(selectedDay)

  const summary: DailySummary | null = useMemo(() => {
    if (!meals) return null
    const consumed = meals.reduce((s, m) => s + m.totals.calories, 0)
    const protein = meals.reduce((s, m) => s + m.totals.protein, 0)
    const carbs = meals.reduce((s, m) => s + m.totals.carbs, 0)
    const fat = meals.reduce((s, m) => s + m.totals.fat, 0)
    return {
      macros: [
        { label: 'CALORIAS', value: Math.round(consumed), max: plan ? Math.round(plan.calories) : 0, unit: 'kcal', color: 'var(--macro-calories)', trackColor: 'var(--macro-calories-light)' },
        { label: 'PROTEÍNA', value: Math.round(protein), max: plan ? Math.round(plan.protein) : 0, unit: 'g', color: 'var(--macro-protein)', trackColor: 'var(--macro-protein-light)' },
        { label: 'CARBOIDRATOS', value: Math.round(carbs), max: plan ? Math.round(plan.carbs) : 0, unit: 'g', color: 'var(--macro-carbs)', trackColor: 'var(--macro-carbs-light)' },
        { label: 'GORDURA', value: Math.round(fat), max: plan ? Math.round(plan.fat) : 0, unit: 'g', color: 'var(--macro-fat)', trackColor: 'var(--macro-fat-light)' },
      ],
    }
  }, [meals, plan])

  return { user, meals, summary, planPending, mealsPending, mealsFetching, mealsError }
}
