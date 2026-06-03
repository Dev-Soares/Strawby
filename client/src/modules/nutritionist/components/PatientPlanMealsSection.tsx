import { Plus } from '@phosphor-icons/react'
import type { MealSummary } from '../../meal/types/meal'
import PatientPlanMealCard from './PatientPlanMealCard'

type Props = {
  meals: MealSummary[] | undefined
  mealsPending: boolean
  patientId: string
  onAddClick: () => void
  onAskDelete: (mealId: string) => void
}

export default function PatientPlanMealsSection({ meals, mealsPending, patientId, onAddClick, onAskDelete }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Refeições planejadas</h2>
          {meals && <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5">{meals.length} {meals.length === 1 ? 'refeição' : 'refeições'}</p>}
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={14} weight="bold" /> Nova refeição
        </button>
      </div>

      {mealsPending && (
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />)}
        </div>
      )}

      {!mealsPending && meals?.length === 0 && (
        <div className="flex flex-col items-center text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl">
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-1">Nenhuma refeição planejada</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">Clique em "Nova refeição" para começar</p>
        </div>
      )}

      {!mealsPending && meals && meals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal, i) => (
            <PatientPlanMealCard
              key={meal.id}
              meal={meal}
              index={i}
              patientId={patientId}
              onAskDelete={onAskDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
