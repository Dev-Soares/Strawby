import { motion } from 'framer-motion'
import type { CalendarDay, DayStatus } from '../types/monthlyScore'

const statusBg: Record<DayStatus, string> = {
  good: 'bg-emerald-500 text-white shadow-[0_8px_18px_-6px_rgba(16,185,129,0.5)]',
  bad: 'bg-red-500 text-white shadow-[0_8px_18px_-6px_rgba(239,68,68,0.5)]',
  neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
}

interface Props {
  day: CalendarDay
  isToday: boolean
}

export default function DayCell({ day, isToday }: Props) {
  const dimmed = day.status === 'neutral' && !isToday

  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <div
        className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full text-xs sm:text-sm font-extrabold tabular-nums transition-colors duration-300 ${
          isToday
            ? 'bg-red-600 text-white shadow-[0_8px_18px_-6px_rgba(220,38,38,0.5)]'
            : dimmed
              ? 'bg-neutral-50 dark:bg-neutral-800/60 text-neutral-300 dark:text-neutral-600'
              : statusBg[day.status]
        }`}
      >
        {day.date}
      </div>
    </motion.div>
  )
}
