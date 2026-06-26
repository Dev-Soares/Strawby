import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { User, CheckCircle, XCircle, Scales, ArrowsVertical, Calendar, GenderMale, GenderFemale } from '@phosphor-icons/react'
import type { NutritionistPatient } from '../types/patient'

interface Props {
  patient: NutritionistPatient
  hasPlan: boolean | null
  index: number
}

const GENDER_LABEL: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
}

export default function PatientCard({ patient, hasPlan, index }: Props) {
  const navigate = useNavigate()

  const initials = patient.user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const bodyStats = [
    patient.weight != null && { icon: Scales, label: `${patient.weight} kg` },
    patient.height != null && { icon: ArrowsVertical, label: `${patient.height} cm` },
    patient.age != null && { icon: Calendar, label: `${patient.age} anos` },
    patient.gender != null && {
      icon: patient.gender === 'male' ? GenderMale : GenderFemale,
      label: GENDER_LABEL[patient.gender] ?? patient.gender,
    },
  ].filter(Boolean) as { icon: typeof Scales; label: string }[]

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
      </div>

      {bodyStats.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {bodyStats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl px-3.5 py-3 transition-colors duration-300"
            >
              <Icon size={16} weight="bold" className="text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span className="text-sm font-bold text-neutral-700 dark:text-neutral-200 truncate">{label}</span>
            </div>
          ))}
        </div>
      )}

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
