import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon } from '@phosphor-icons/react'
import { useGetPatientStreak } from '../hooks/useGetPatientStreak'
import PatientStreakSkeleton from '../skeletons/PatientStreakSkeleton'

const FireAnimation = lazy(() => import('./FireAnimation'))

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
      className="flex flex-col items-center text-center py-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={<div style={{ width: 140, height: 140 }} />}>
        <FireAnimation />
      </Suspense>

      <div className="mt-1 flex items-end gap-1.5 justify-center">
        <span className="font-display text-6xl sm:text-7xl font-extrabold text-red-500 leading-none tabular-nums tracking-tight">
          {streak.currentStreak}
        </span>
        <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500 pb-2.5 transition-colors duration-300">
          dias
        </span>
      </div>

      <span className="text-base sm:text-lg font-semibold text-red-500 mt-1.5 transition-colors duration-300">
        {streakLabel}
      </span>

      <p className="mt-4 text-base font-bold text-neutral-500 dark:text-neutral-400 text-center max-w-72 leading-relaxed transition-colors duration-300">
        Registre suas refeições todos os dias para manter sua streak. Um dia sem registro ou muito longe do seu plano quebra a sequência.
      </p>

      <div className="flex flex-col items-center gap-1.5 mt-5 px-6 py-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-colors duration-300">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow-500/70 transition-colors duration-300">
          Melhor streak
        </span>
        <div className="flex items-center gap-2 mt-1">
          <TrophyIcon size={42} weight="duotone" className="text-yellow-500 shrink-0 mb-2" />
          <span className="font-display text-4xl font-extrabold text-yellow-500 leading-none tabular-nums tracking-tight">
            {streak.bestStreak}
          </span>
          <span className="text-sm font-bold text-yellow-500/70 transition-colors duration-300">
            dias
          </span>
        </div>
      </div>
    </motion.div>
  )
}
