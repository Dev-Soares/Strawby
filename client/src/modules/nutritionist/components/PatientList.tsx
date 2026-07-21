import { Users, LinkIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import PatientCardWithStatus from './PatientCardWithStatus'
import type { NutritionistPatient } from '../types/patient'

interface Props {
  patients: NutritionistPatient[]
}

export default function PatientList({ patients }: Props) {
  const navigate = useNavigate()

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16 px-4 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 transition-colors duration-300">
          <Users size={26} weight="duotone" className="text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300">
          Nenhum paciente ainda
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs leading-relaxed mb-5 transition-colors duration-300">
          Compartilhe seu código de convite para que pacientes possam se vincular à sua conta.
        </p>
        <button
          type="button"
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
        >
          <LinkIcon size={15} weight="bold" />
          Ver meu código
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {patients.map((patient, index) => (
        <PatientCardWithStatus key={patient.id} patient={patient} index={index} />
      ))}
    </div>
  )
}
