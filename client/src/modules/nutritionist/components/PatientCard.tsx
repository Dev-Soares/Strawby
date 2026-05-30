import { motion } from 'framer-motion'
import { User, CheckCircle, XCircle, ArrowRight } from '@phosphor-icons/react'
import type { NutritionistPatient } from '../types/patient'

interface Props {
  patient: NutritionistPatient
  hasPlan: boolean | null
  index: number
  onClick: () => void
}

export default function PatientCard({ patient, hasPlan, index, onClick }: Props) {
  const initials = patient.user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <motion.button
      className="group w-full text-left bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 shadow-sm hover:shadow-md p-5 flex flex-col gap-4 transition-all duration-200 cursor-pointer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 transition-colors duration-300">
          {initials ? (
            <span className="text-sm font-extrabold text-red-600 dark:text-red-400">{initials}</span>
          ) : (
            <User size={16} weight="bold" className="text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate transition-colors duration-300">
            {patient.user.name}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5 transition-colors duration-300">
            {patient.user.email}
          </p>
        </div>
        <ArrowRight
          size={14}
          weight="bold"
          className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 dark:group-hover:text-neutral-400 transition-colors duration-200 mt-0.5 shrink-0"
        />
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 transition-colors duration-300">
        {hasPlan === null ? (
          <div className="h-5 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        ) : hasPlan ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} weight="fill" className="text-green-500" />
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">Plano ativo</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <XCircle size={14} weight="fill" className="text-neutral-300 dark:text-neutral-600" />
            <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">Sem plano</span>
          </div>
        )}
      </div>
    </motion.button>
  )
}
