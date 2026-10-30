import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useGetPatientStreak } from '../hooks/useGetPatientStreak'
import BestStreakCardSkeleton from '../skeletons/BestStreakCardSkeleton'
import { STREAK_COLORS } from '@/shared/config/score'

const { color } = STREAK_COLORS.best

export default function BestStreakCard() {
  const { data: streak, isPending, isError } = useGetPatientStreak()

  if (isPending) return <BestStreakCardSkeleton />
  if (isError || !streak) return null

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2
        className="font-display text-base sm:text-xl font-extrabold tracking-tight"
        style={{ color }}
      >
        Melhor sequência
      </h2>

      <div className="mt-3 sm:mt-5 flex items-center gap-3 sm:gap-5">
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <Trophy className="h-11 w-11 sm:h-18 sm:w-18" strokeWidth={1.75} style={{ color }} />
        </motion.span>

        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span
            className="font-display text-5xl sm:text-7xl font-extrabold leading-none tabular-nums tracking-tight"
            style={{ color }}
          >
            {streak.bestStreak}
          </span>
          <span className="text-sm sm:text-base font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
            dias
          </span>
        </div>
      </div>

      <p className="mt-3 sm:mt-5 max-w-64 sm:max-w-80 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
        Meu recorde de dias consecutivos dentro do plano.
      </p>
    </motion.div>
  )
}
