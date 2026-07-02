import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, CheckCircle, XCircle } from '@phosphor-icons/react'
import type { NutritionistPatient } from '../types/patient'

interface Props {
  patient: NutritionistPatient
  hasPlan: boolean | null
  index: number
}

export default function PatientCard({ patient, hasPlan, index }: Props) {
  const navigate = useNavigate()

  return (
    <motion.button
      className="group w-full text-left bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 shadow-sm hover:shadow-md p-5 flex flex-col gap-4 transition-all duration-200 cursor-pointer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={() => navigate(`/app/nutritionist/patient/${patient.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 transition-colors duration-300">
          <User size={18} weight="bold" className="text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 truncate transition-colors duration-300">
            {patient.user.name}
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 truncate mt-0.5 transition-colors duration-300">
            {patient.user.email}
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 transition-colors duration-300">
        {hasPlan === null ? (
          <div className="h-11 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        ) : (
          <div className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors duration-200 ${
            hasPlan
              ? 'bg-red-600 group-hover:bg-red-700 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
          }`}>
            {hasPlan
              ? <><CheckCircle size={16} weight="fill" /> Ver plano</>
              : <><XCircle size={16} weight="fill" /> Criar plano</>
            }
          </div>
        )}
      </div>
    </motion.button>
  )
}
