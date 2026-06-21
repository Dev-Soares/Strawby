import { motion } from 'framer-motion'
import { TrophyIcon } from '@phosphor-icons/react'
import { useGetPatientStreak } from '../hooks/useGetPatientStreak'
import BestStreakCardSkeleton from '../skeletons/BestStreakCardSkeleton'

export default function BestStreakCard() {
  const { data: streak, isPending, isError } = useGetPatientStreak()

  if (isPending) return <BestStreakCardSkeleton />
  if (isError || !streak) return null

  return (
    <section className="mb-5">
      <div className="mb-5 px-1">
        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Melhor sequência
        </h2>
        <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          Seu recorde de dias consecutivos
        </p>
      </div>

      <motion.div
        className="flex flex-col items-center text-center py-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 text-6xl sm:text-7xl">
          <TrophyIcon size="1em" weight="duotone" className="text-yellow-500" />
          <div className="flex items-center gap-1.5">
            <span className="font-display text-[1em] font-extrabold text-yellow-500 leading-none tabular-nums tracking-tight mt-4">
              {streak.bestStreak}
            </span>
            <span className="text-sm font-bold text-yellow-500/70 mt-6">dias</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
