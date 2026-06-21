import { motion } from 'framer-motion'
import { useGetAverageScore } from '../hooks/useGetAverageScore'
import TotalScoreCardSkeleton from '../skeletons/TotalScoreCardSkeleton'
import ScoreCircle from './ScoreCircle'

function getScoreColor(score: number) {
  if (score >= 8) return '#10b981'
  if (score >= 6) return '#f59e0b'
  if (score >= 4) return '#f97316'
  return '#dc2626'
}

export default function TotalScoreCard() {
  const { data, isPending, isError } = useGetAverageScore()

  if (isPending) return <TotalScoreCardSkeleton />
  if (isError || !data || data.score == null) return null

  const score = Math.round(data.score * 10) / 10
  const color = getScoreColor(score)

  return (
    <section className="mb-5">
      <div className="mb-5 px-1">
        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Score total
        </h2>
        <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          Pontuação média geral da sua conta
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
