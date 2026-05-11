import { motion } from 'framer-motion'
import { ArrowRight, Plus } from '@phosphor-icons/react'
import type { Meal } from '../types/meal'
import MealCard from './MealCard'

interface MealListProps {
  meals: Meal[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function MealList({ meals }: MealListProps) {
  const totalKcal = meals.reduce((sum, m) => sum + m.kcal, 0)

  return (
    <div>
      <div className="flex items-end justify-between mb-3 sm:mb-5 px-1 gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-neutral-900">Refeições de hoje</h2>
          <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
            Seu histórico do dia
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-[11px] sm:text-xs font-black text-neutral-500 tabular-nums">
            {totalKcal.toLocaleString('pt-BR')} kcal
          </span>
          <button className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer">
            Ver todas
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>
      </div>

      <motion.div
        className="flex flex-col gap-2.5 sm:gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {meals.map((meal) => (
          <motion.div key={meal.id} variants={item}>
            <MealCard meal={meal} />
          </motion.div>
        ))}

        <motion.button
          className="flex items-center justify-center gap-2 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-dashed border-neutral-200 text-[13px] sm:text-sm font-semibold text-neutral-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all duration-200 cursor-pointer mt-1"
          variants={item}
        >
          <Plus size={16} weight="bold" />
          Adicionar refeição
        </motion.button>
      </motion.div>
    </div>
  )
}
