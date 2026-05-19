import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from '@phosphor-icons/react'
import { useGetPlanMeals } from '../../meal/hooks/useGetPlanMeals'
import MealCard from '../../meal/components/MealCard'
import PlanMealsSectionSkeleton from '../skeletons/PlanMealsSectionSkeleton'

export default function PlanMealsSection() {
  const { data: meals, isPending, isError, error } = useGetPlanMeals()
  const [openId, setOpenId] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  const totalKcal = meals?.reduce((a, m) => a + m.totals.calories, 0) ?? 0

  return (
    <div className="px-4 sm:px-10 lg:px-16 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-none">
            Refeições planejadas
          </h2>
          <p className="text-sm text-neutral-500 mt-1.5">Distribuição do seu plano ao longo do dia</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-neutral-500 tabular-nums hidden sm:block">
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
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm font-semibold text-red-600">Erro ao carregar refeições planejadas</p>
          <p className="text-xs text-red-400 mt-1">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      )}

      {meals && meals.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm font-semibold text-neutral-500 mb-1">Nenhuma refeição planejada</p>
          <p className="text-xs text-neutral-400">Clique em "Nova refeição" para começar</p>
        </div>
      )}

      {meals && meals.length > 0 && (
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
      )}
    </div>
  )
}
