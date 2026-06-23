import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, CalendarBlank } from '@phosphor-icons/react'
import { useGetPlanMeals } from '../../meal/hooks/useGetPlanMeals'
import MealCard from '../../meal/components/MealCard'
import PlanProgressCard from './PlanProgressCard'
import PlanMealsSectionSkeleton from '../skeletons/PlanMealsSectionSkeleton'

export default function PlanMealsSection() {
  const { data: meals, isPending, isError, error } = useGetPlanMeals()
  const [openId, setOpenId] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  const totalKcal = meals?.reduce((a, m) => a + m.totals.calories, 0) ?? 0

  return (
    <div className="px-4 sm:px-10 lg:px-16 pt-2 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
            Refeições planejadas
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 transition-colors duration-300">Distribuição do seu plano ao longo do dia</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-neutral-500 dark:text-neutral-400 tabular-nums hidden sm:block transition-colors duration-300">
            {meals?.length ?? 0} refeições · {Math.round(totalKcal).toLocaleString('pt-BR')} kcal total
          </span>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              navigate('/app/meals/new?type=plan-meal')
            }}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors duration-150 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Plus size={15} weight="bold" />
            Nova refeição
          </button>
        </div>
      </div>

      {isPending && <PlanMealsSectionSkeleton />}

      {isError && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30 p-4 transition-colors duration-300">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400 transition-colors duration-300">Erro ao carregar refeições planejadas</p>
          <p className="text-xs text-red-400 dark:text-red-500 mt-1 transition-colors duration-300">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      )}

      {meals && meals.length === 0 && (
        <div className="flex flex-col items-center text-center py-16 px-4 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 transition-colors duration-300">
            <CalendarBlank size={24} weight="duotone" className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">
            Nenhuma refeição planejada
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-5 max-w-xs leading-relaxed transition-colors duration-300">
            Organize seu plano alimentar adicionando as refeições do dia
          </p>
          <button
            onClick={() => navigate('/app/meals/new?type=plan-meal')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <Plus size={15} weight="bold" />
            Adicionar refeição
          </button>
        </div>
      )}

      {meals && meals.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                isOpen={openId === meal.id}
                onToggle={() => toggle(meal.id)}
              />
            ))}
          </div>

          <div className="mt-8">
            <PlanProgressCard />
          </div>
        </>
      )}
    </div>
  )
}
