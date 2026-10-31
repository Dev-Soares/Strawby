import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Utensils } from 'lucide-react'
import type { Meal } from '../../meal/types/meal'
import MealCard from '../../meal/components/MealCard'
import { useDay } from '../hooks/useDay'

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
  const { selectedDay, isToday } = useDay()
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  const goToCreateMeal = () => navigate(`/app/meals/new?type=meal&date=${selectedDay}`)

  return (
    <div>
      <div className="mb-5 sm:mb-7 px-1 mt-5 sm:mt-7">
        <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
          {isToday ? 'Refeições de hoje' : 'Refeições do dia'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          Seu histórico do dia
        </p>
      </div>

      {meals.length === 0 ? (
        <motion.div
          key={`empty-${selectedDay}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center py-10 px-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center mb-4 transition-colors duration-300">
            <Utensils size={26} className="text-neutral-500 dark:text-neutral-300" />
          </div>
          <p className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-1 transition-colors duration-300">
            {isToday ? 'Nenhuma refeição hoje' : 'Sem refeições neste dia'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 max-w-50 leading-relaxed transition-colors duration-300">
            {isToday
              ? 'Registre o que você comeu para acompanhar seus macros'
              : 'Registre o que você comeu neste dia para acompanhar seus macros'}
          </p>
          <button
            type="button"
            onClick={goToCreateMeal}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <Plus size={15} />
            Adicionar refeição
          </button>
        </motion.div>
      ) : (
        <motion.div
          key={`list-${selectedDay}`}
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

          <motion.button
            type="button"
            onClick={goToCreateMeal}
            className="flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl bg-red-600 text-white text-sm sm:text-base font-bold hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mt-1"
            variants={item}
          >
            <Plus size={18} />
            Adicionar refeição
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
