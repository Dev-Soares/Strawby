import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusIcon } from '@phosphor-icons/react'
import type { MealListProps } from '../types/mealList'
import MealCard from './MealCard'
import { useDay } from '../contexts/DayContext'

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
  const navigate = useNavigate()
  const { isToday } = useDay()
  const totalKcal = meals.reduce((sum, m) => sum + m.totals.calories, 0)
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div>
      <div className="flex items-end justify-between mb-3 sm:mb-5 px-1 gap-2 mt-1">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900">Refeições de hoje</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Seu histórico do dia
          </p>
        </div>
        <span className="text-xs sm:text-sm font-extrabold text-neutral-500 tabular-nums shrink-0">
          {Math.round(totalKcal).toLocaleString('pt-BR')} kcal
        </span>
      </div>

      <motion.div
        className="flex flex-col gap-2.5 sm:gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {meals.map((meal) => (
          <motion.div key={meal.id} variants={item}>
            <MealCard
              meal={meal}
              isOpen={openId === meal.id}
              onToggle={() => toggle(meal.id)}
            />
          </motion.div>
        ))}

        {isToday && (
          <motion.button
            type="button"
            onClick={() => navigate('/meals/new?type=meal')}
            className="flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl bg-red-600 text-white text-sm sm:text-base font-bold hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mt-1"
            variants={item}
          >
            <PlusIcon size={18} weight="bold" />
            Adicionar refeição
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
