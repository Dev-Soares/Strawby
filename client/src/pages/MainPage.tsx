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
    if (!plan || !meals) return null
    const consumed = meals.reduce((s, m) => s + m.totals.calories, 0)
    const protein = meals.reduce((s, m) => s + m.totals.protein, 0)
    const carbs = meals.reduce((s, m) => s + m.totals.carbs, 0)
    const fat = meals.reduce((s, m) => s + m.totals.fat, 0)
    return {
      macros: [
        { label: 'CALORIAS', value: Math.round(consumed), max: Math.round(plan.calories), unit: 'kcal', color: '#dc2626', trackColor: '#fee2e2' },
        { label: 'PROTEÍNA', value: Math.round(protein), max: Math.round(plan.protein), unit: 'g', color: '#f59e0b', trackColor: '#fef3c7' },
        { label: 'CARBOIDRATOS', value: Math.round(carbs), max: Math.round(plan.carbs), unit: 'g', color: '#3b82f6', trackColor: '#dbeafe' },
        { label: 'GORDURA', value: Math.round(fat), max: Math.round(plan.fat), unit: 'g', color: '#a855f7', trackColor: '#f3e8ff' },
      ],
    }
  }, [meals, plan])

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-50/50 via-neutral-50 to-neutral-50 min-h-screen">
        <motion.div
          className="mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm font-extrabold text-neutral-500 uppercase tracking-widest mb-3 sm:mb-4">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            }).replace(/^\w/, (c) => c.toUpperCase())}
          </p>
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 leading-tight tracking-tight mb-2">
            Olá, {user?.name ?? 'Bem-vindo'}
          </p>
          <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 leading-tight tracking-tight">
            Vamos cuidar da sua{' '}
            <span className="text-red-600">alimentação</span>?
          </h1>
        </motion.div>

        <DaySelector />

        {mealsError && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 mb-6 mt-4">
            <p className="text-sm font-semibold text-red-600">Erro ao carregar refeições</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
          {planPending || mealsPending ? (
            <>
              <DailySummarySkeleton />
              <MealListSkeleton />
            </>
          ) : summary && meals ? (
            <>
              <DailySummary data={summary} />
              <MealList meals={meals} />
            </>
          ) : null}
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
