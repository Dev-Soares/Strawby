import { motion } from 'framer-motion'
import type { Food } from '../types/food'
import FoodCard from './FoodCard'

interface FoodGridProps {
  foods: Food[]
  total: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function FoodGrid({ foods, total }: FoodGridProps) {
  return (
    <div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 transition-colors duration-300">
        {total} alimento{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {foods.map((food) => (
          <motion.div key={food.id} variants={item}>
            <FoodCard food={food} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
