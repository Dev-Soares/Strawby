import { motion } from 'framer-motion'
import { Gauge } from 'lucide-react'
import { useGetDailyLiveScore } from '../hooks/useGetDailyLiveScore'
import DailyScoreCardSkeleton from '../skeletons/DailyScoreCardSkeleton'
import ScoreCircle from './ScoreCircle'
import { toLocalISODate } from '@/shared/utils/date'
import { getScoreTier } from '@/shared/config/score'

export default function DailyScoreCard() {
  const today = toLocalISODate()
  const { data: score, isPending, isError } = useGetDailyLiveScore(today)

  if (isPending) return <DailyScoreCardSkeleton />
  if (isError || score === undefined) return null

  const tier = getScoreTier(score)
  const TierIcon = tier.icon

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: tier.track }}
        >
          <Gauge size={18} style={{ color: tier.color }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color: tier.color }}>
          Score de hoje
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <ScoreCircle score={score} color={tier.color} track={tier.track} />

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-tight"
            style={{ backgroundColor: tier.track, color: tier.color }}
          >
            <TierIcon size={14} />
            {tier.label}
          </span>

          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            {tier.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
