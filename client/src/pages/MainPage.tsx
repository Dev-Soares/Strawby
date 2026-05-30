import { useMemo } from 'react'
import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import DailySummary from '../modules/home/components/DailySummary'
import MealList from '../modules/home/components/MealList'
import DaySelector from '../modules/home/components/DaySelector'
import DailySummarySkeleton from '../modules/home/skeletons/DailySummarySkeleton'
import MealListSkeleton from '../modules/home/skeletons/MealListSkeleton'
import { DayProvider, useDay } from '../modules/home/contexts/DayContext'
import { useAuth } from '../modules/auth/hooks/useAuth'
import { useGetMealsByDay } from '../modules/meal/hooks/useGetMealsByDay'
import { useGetPlan } from '../modules/plan/hooks/useGetPlan'
import type { DailySummary as DailySummaryType } from '../modules/home/types/dailySummary'

function MainPageContent() {
  const { data: user } = useAuth()
  const { data: plan, isPending: planPending } = useGetPlan()
  const { selectedDay } = useDay()

  const {
    data: meals,
    isPending: mealsPending,
    isError: mealsError,
  } = useGetMealsByDay(selectedDay)

  const summary: DailySummaryType | null = useMemo(() => {
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

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-50/50 dark:from-amber-950/30 via-neutral-50 dark:via-neutral-950 to-neutral-50 dark:to-neutral-950 min-h-screen transition-colors duration-300">
        <motion.div
          className="mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3 sm:mb-4 transition-colors duration-300">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            }).replace(/^\w/, (c) => c.toUpperCase())}
          </p>
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight mb-2 transition-colors duration-300">
            Olá, {user?.name ?? 'Bem-vindo'}
          </p>
          <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight transition-colors duration-300">
            Vamos cuidar da sua{' '}
            <span className="text-red-600">alimentação</span>?
          </h1>
        </motion.div>

        <DaySelector />

        {mealsError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 p-4 mb-6 mt-4 transition-colors duration-300">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 transition-colors duration-300">Erro ao carregar refeições</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
          {planPending || mealsPending ? (
            <>
              <DailySummarySkeleton />
              <MealListSkeleton />
            </>
          ) : (
            <>
              {summary ? <DailySummary data={summary} /> : <DailySummarySkeleton />}
              {meals ? <MealList meals={meals} /> : null}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default function MainPage() {
  return (
    <DayProvider>
      <MainPageContent />
    </DayProvider>
  )
}
