import { motion } from 'framer-motion'
import { User } from '@phosphor-icons/react'
import { useGetPatientAverageScore } from '../hooks/useGetPatientAverageScore'
import PatientScoreCardSkeleton from '../skeletons/PatientScoreCardSkeleton'
import type { NutritionistPatient } from '../types/patient'

interface Props {
  patient: NutritionistPatient
  index: number
}

function getScoreLabel(score: number) {
  if (score >= 8) return 'Excelente'
  if (score >= 5) return 'Bom'
  if (score >= 3) return 'Regular'
  return 'Precisa melhorar'
}

function getScoreColor(score: number) {
  if (score >= 8) return { hex: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' }
  if (score >= 5) return { hex: '#f59e0b', bg: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' }
  return { hex: '#ef4444', bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300' }
}

export default function PatientScoreCard({ patient, index }: Props) {
  const { data, isPending } = useGetPatientAverageScore(patient.id)

  if (isPending) return <PatientScoreCardSkeleton />

  const score = data?.score != null ? Math.round(data.score * 10) / 10 : null
  const color = score != null ? getScoreColor(score) : null
  const pct = score != null ? Math.min((score / 10) * 100, 100) : 0

  const initials = patient.user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col gap-4 transition-colors duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 transition-colors duration-300">
          {initials ? (
            <span className="text-base font-extrabold text-red-600 dark:text-red-400">{initials}</span>
          ) : (
            <User size={18} weight="bold" className="text-red-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 truncate transition-colors duration-300">
            {patient.user.name}
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 truncate mt-0.5 transition-colors duration-300">
            {patient.user.email}
          </p>
        </div>

        {score != null && (
          <div className="shrink-0 flex flex-col items-center">
            <span className={`font-display text-3xl font-extrabold tabular-nums leading-none ${color!.text}`}>
              {score}
            </span>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-0.5">/10</span>
          </div>
        )}
      </div>

      {score != null ? (
        <div className="flex flex-col gap-2">
          <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden transition-colors duration-300">
            <motion.div
              className={`h-full rounded-full ${color!.bg}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
            />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${color!.badge}`}>
            {getScoreLabel(score)}
          </span>
        </div>
      ) : (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
          Sem pontuações registradas ainda
        </p>
      )}
    </motion.div>
  )
}
