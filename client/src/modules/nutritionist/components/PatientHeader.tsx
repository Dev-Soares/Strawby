import { motion } from 'framer-motion'
import {
  ArrowLeft, Scales, ArrowsVertical, Calendar, GenderMale, GenderFemale, UserMinus,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import type { NutritionistPatient } from '../types/patient'

type Props = {
  patient: NutritionistPatient | undefined
  onRemovePatient: () => void
}

const buildBodyStats = (patient: NutritionistPatient) => {
  const stats: { Icon: typeof Scales; label: string }[] = []
  if (patient.weight != null) stats.push({ Icon: Scales, label: `${patient.weight} kg` })
  if (patient.height != null) stats.push({ Icon: ArrowsVertical, label: `${patient.height} cm` })
  if (patient.age != null) stats.push({ Icon: Calendar, label: `${patient.age} anos` })
  if (patient.gender != null) {
    stats.push({
      Icon: patient.gender === 'male' ? GenderMale : GenderFemale,
      label: patient.gender === 'male' ? 'Masculino' : 'Feminino',
    })
  }
  return stats
}

export default function PatientHeader({ patient, onRemovePatient }: Props) {
  const navigate = useNavigate()
  const bodyStats = patient ? buildBodyStats(patient) : []

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        type="button"
        onClick={() => navigate('/app/home')}
        className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} weight="bold" />
        Meus pacientes
      </button>
      <div className="min-w-0">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight truncate">
          {patient?.user.name ?? '—'}
        </h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1 truncate">{patient?.user.email}</p>
      </div>
      {bodyStats.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {bodyStats.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 py-2">
              <Icon size={15} weight="bold" className="text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">{label}</span>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onRemovePatient}
        className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors duration-150 cursor-pointer"
      >
        <UserMinus size={16} weight="bold" />
        Remover paciente
      </button>
    </motion.div>
  )
}
