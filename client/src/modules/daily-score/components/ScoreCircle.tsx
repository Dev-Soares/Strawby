import { motion } from 'framer-motion'

interface ScoreCircleProps {
  score: number
  max?: number
  color: string
  /** Cor do trilho — tom claro do mesmo tier */
  track: string
  size?: number
  strokeWidth?: number
}

export default function ScoreCircle({
  score,
  max = 10,
  color,
  track,
  size = 148,
  strokeWidth = 12,
}: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(score / max, 1))
  const offset = circumference * (1 - pct)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-5xl font-extrabold leading-none tabular-nums tracking-tight"
          style={{ color }}
        >
          {Math.round(score * 10) / 10}
        </span>
        <span className="mt-1 text-xs font-bold tabular-nums text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
          de {max}
        </span>
      </div>
    </div>
  )
}
