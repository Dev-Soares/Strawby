import PatientCard from './PatientCard'
import type { NutritionistPatient } from '../types/patient'
import { useGetPatientPlan } from '../hooks/useGetPatientPlan'

interface Props {
  patient: NutritionistPatient
  index: number
}

export default function PatientCardWithStatus({ patient, index }: Props) {
  const { data: plan, isPending } = useGetPatientPlan(patient.id)
  const hasPlan = isPending ? null : plan !== null && plan !== undefined

  return <PatientCard patient={patient} hasPlan={hasPlan} index={index} />
}
