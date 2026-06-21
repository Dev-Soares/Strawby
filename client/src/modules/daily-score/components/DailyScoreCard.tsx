import { motion } from 'framer-motion'
import { useGetDailyLiveScore } from '../hooks/useGetDailyLiveScore'
import DailyScoreCardSkeleton from '../skeletons/DailyScoreCardSkeleton'
import ScoreCircle from './ScoreCircle'
import { toLocalISODate } from '@/shared/utils/date'

function getScoreColor(score: number) {
  if (score >= 8) return '#10b981'
  if (score >= 5) return '#f59e0b'
  return '#dc2626'
}

export default function DailyScoreCard() {
  const today = toLocalISODate()
  const { data: score, isPending, isError } = useGetDailyLiveScore(today)

  if (isPending) return <DailyScoreCardSkeleton />
  if (isError || score === undefined) return null

  const color = getScoreColor(score)

  return (
    <section className="mb-5">
      <div className="mb-5 px-1">
        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Score do dia
        </h2>
        <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          Calculado a partir dos seus registros de hoje
        </p>
      </div>

      <motion.div
        className="flex flex-col items-center text-center py-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ScoreCircle score={score} color={color} />
      </motion.div>
    </section>
  )
}
