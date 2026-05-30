import { Users } from '@phosphor-icons/react'
import PatientCard from './PatientCard'
import type { NutritionistPatient } from '../types/patient'
import { useGetPatientPlan } from '../hooks/useGetPatientPlan'

function PatientCardWithStatus({ patient, index }: { patient: NutritionistPatient; index: number }) {
  const { data: plan, isPending } = useGetPatientPlan(patient.id)
  const hasPlan = isPending ? null : plan !== null && plan !== undefined

  return <PatientCard patient={patient} hasPlan={hasPlan} index={index} />
}

interface Props {
  patients: NutritionistPatient[]
}

export default function PatientList({ patients }: Props) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-16 px-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5 transition-colors duration-300">
          <Users size={26} weight="fill" className="text-neutral-300 dark:text-neutral-600" />
        </div>
        <p className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300">
          Nenhum paciente ainda
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs leading-relaxed transition-colors duration-300">
          Compartilhe seu código de convite para que pacientes possam se vincular à sua conta.
        </p>
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
