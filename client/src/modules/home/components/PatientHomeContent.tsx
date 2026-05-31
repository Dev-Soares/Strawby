import AppLayout from '../../../shared/layouts/AppLayout'
import DailySummary from '../../daily-summary/components/DailySummary'
import MealList from '../../daily-summary/components/MealList'
import DaySelector from '../../daily-summary/components/DaySelector'
import DailySummarySkeleton from '../../daily-summary/skeletons/DailySummarySkeleton'
import MealListSkeleton from '../../daily-summary/skeletons/MealListSkeleton'
import PatientHomeHeader from './PatientHomeHeader'
import { usePatientHome } from '../hooks/usePatientHome'

export default function PatientHomeContent() {
  const { user, meals, summary, planPending, mealsPending, mealsFetching, mealsError } = usePatientHome()

  const firstLoad = planPending || mealsPending

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-50/50 dark:from-amber-950/30 via-neutral-50 dark:via-neutral-950 to-neutral-50 dark:to-neutral-950 min-h-screen transition-colors duration-300">
        <PatientHomeHeader name={user?.name ?? 'Bem-vindo'} />

        <DaySelector />

        {mealsError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 p-4 mb-6 mt-4 transition-colors duration-300">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400 transition-colors duration-300">Erro ao carregar refeições</p>
          </div>
        )}

        {firstLoad ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
            <DailySummarySkeleton />
            <MealListSkeleton />
          </div>
        ) : (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start transition-opacity duration-200 ${mealsFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {summary ? <DailySummary data={summary} /> : <DailySummarySkeleton />}
            {meals ? <MealList meals={meals} /> : null}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
