import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusIcon, ForkKnifeIcon } from '@phosphor-icons/react'
import type { Meal } from '../../meal/types/meal'
import MealCard from '../../meal/components/MealCard'
import { useDay } from '../contexts/DayContext'

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
  const navigate = useNavigate()
  const { isToday } = useDay()
  const totalKcal = meals.reduce((sum, m) => sum + m.totals.calories, 0)
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div>
      <div className="flex items-end justify-between mb-5 sm:mb-7 px-1 gap-2 mt-5 sm:mt-7">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">Refeições de hoje</h2>
          <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
            Seu histórico do dia
          </p>
        </div>
        <span className="text-xl sm:text-2xl font-extrabold text-red-600 tabular-nums shrink-0 leading-none mb-0.5">
          {Math.round(totalKcal).toLocaleString('pt-BR')} kcal
        </span>
      </div>

      {meals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center py-10 px-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 transition-colors duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4 transition-colors duration-300">
            <ForkKnifeIcon size={24} weight="duotone" className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">
            {isToday ? 'Nenhuma refeição hoje' : 'Sem refeições neste dia'}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-5 max-w-50 leading-relaxed transition-colors duration-300">
            {isToday
              ? 'Registre o que você comeu para acompanhar seus macros'
              : 'Nenhuma refeição foi registrada neste dia'}
          </p>
          {isToday && (
            <button
              type="button"
              onClick={() => navigate('/app/meals/new?type=meal')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <PlusIcon size={15} weight="bold" />
              Adicionar refeição
            </button>
          )}
        </motion.div>
      ) : (
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
              onClick={() => navigate('/app/meals/new?type=meal')}
              className="flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl bg-red-600 text-white text-sm sm:text-base font-bold hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mt-1"
              variants={item}
            >
              <PlusIcon size={18} weight="bold" />
              Adicionar refeição
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}
