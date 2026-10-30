import { motion } from 'framer-motion'
import type { CalendarDay } from '../types/monthlyScore'
import { getScoreTier } from '@/shared/config/score'

interface Props {
  day: CalendarDay
  isToday: boolean
}

export default function DayCell({ day, isToday }: Props) {
  const tier = day.score === undefined ? null : getScoreTier(day.score)

  return (
    <motion.div
      className={`flex aspect-square items-center justify-center rounded-xl text-sm font-extrabold tabular-nums transition-colors duration-300 ${
        tier
          ? ''
          : 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-300 dark:text-neutral-600'
      } ${
        isToday
          ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900'
          : ''
      }`}
      style={tier ? { backgroundColor: tier.track, color: tier.color } : undefined}
      title={tier ? `Dia ${day.date} — score ${day.score}` : `Dia ${day.date} — sem registro`}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {day.date}
    </motion.div>
  )
}
