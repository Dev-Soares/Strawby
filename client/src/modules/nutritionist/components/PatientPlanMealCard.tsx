import { motion } from 'framer-motion'
import { PencilSimple, Trash } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import type { MealSummary } from '../../meal/types/meal'
import { getMealType } from '@/shared/config/mealTypes'

type Props = {
  meal: MealSummary
  index: number
  patientId: string
  onAskDelete: (mealId: string) => void
}

export default function PatientPlanMealCard({ meal, index, patientId, onAskDelete }: Props) {
  const navigate = useNavigate()
  const cfg = getMealType(meal.mealType)
  const MealIcon = cfg.icon
  const totalKcal = Math.round(meal.totals.calories)

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cfg.color}20` }}>
            <MealIcon size={18} weight="bold" style={{ color: cfg.color }} />
          </div>
          <span className="text-base font-extrabold truncate" style={{ color: cfg.color }}>{meal.name}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-display text-3xl font-extrabold tabular-nums" style={{ color: cfg.color }}>{totalKcal}</span>
          <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500">kcal</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { l: 'Prot', v: Math.round(meal.totals.protein) },
            { l: 'Carb', v: Math.round(meal.totals.carbs) },
            { l: 'Gord', v: Math.round(meal.totals.fat) },
          ].map(({ l, v }) => (
            <span key={l} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
              {v}g {l}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 flex">
        <button
          onClick={() => navigate(`/app/meals/${meal.id}?patientId=${patientId}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <PencilSimple size={15} weight="bold" /> Editar alimentos
        </button>
        <div className="w-px bg-neutral-100 dark:bg-neutral-800" />
        <button
          onClick={() => onAskDelete(meal.id)}
          className="flex items-center justify-center gap-1.5 px-5 py-3.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <Trash size={15} weight="bold" /> Remover
        </button>
      </div>
    </motion.div>
  )
}
