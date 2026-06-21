import { motion } from 'framer-motion'

interface ScoreCircleProps {
  score: number
  max?: number
  color: string
  size?: number
  strokeWidth?: number
}

export default function ScoreCircle({ score, max = 10, color, size = 132, strokeWidth = 11 }: ScoreCircleProps) {
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
          strokeWidth={strokeWidth}
          className="stroke-neutral-100 dark:stroke-neutral-800 transition-colors duration-300"
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
        <span className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-none tabular-nums tracking-tight transition-colors duration-300">
          {Math.round(score * 10) / 10}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest mt-1 transition-colors duration-300">
          / 10
        </span>
      </div>
    </div>
  )
}
