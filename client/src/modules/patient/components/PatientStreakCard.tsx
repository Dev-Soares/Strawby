import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useGetPatientStreak } from '../hooks/useGetPatientStreak'
import PatientStreakSkeleton from '../skeletons/PatientStreakSkeleton'
import { STREAK_COLORS } from '@/shared/config/score'

const FireAnimation = lazy(() => import('./FireAnimation'))

const { color, track } = STREAK_COLORS.current

export default function PatientStreakCard() {
  const { data: streak, isPending, isError } = useGetPatientStreak()

  if (isPending) return <PatientStreakSkeleton />
  if (isError || !streak) return null

  const streakLabel =
    streak.currentStreak === 0
      ? 'Nenhum dia consecutivo'
      : streak.currentStreak === 1
        ? 'Primeiro dia!'
        : 'Dias consecutivos'

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: track }}
        >
          <Flame size={18} style={{ color }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color }}>
          Minha sequência
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <Suspense fallback={<div className="shrink-0" style={{ width: 132, height: 132 }} />}>
          <FireAnimation size={132} />
        </Suspense>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex items-baseline justify-center gap-2 sm:justify-start">
            <span
              className="font-display text-6xl font-extrabold leading-none tabular-nums tracking-tight"
              style={{ color }}
            >
              {streak.currentStreak}
            </span>
            <span className="text-base font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              dias
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            {streakLabel}
          </p>

          <div className="mt-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/30 px-4 py-3 transition-colors duration-300">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 leading-relaxed transition-colors duration-300">
              Registre as refeições todo dia para manter a sequência. Um dia sem registro, ou muito
              longe do plano, zera a contagem.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
