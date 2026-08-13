import { useState } from 'react'
import { useGetPatientWeightRecords } from '@/modules/patient/hooks/useGetPatientWeightRecords'
import { useUpdatePatient } from '@/modules/patient/hooks/useUpdatePatient'
import { deriveWeightGoal } from '@/shared/utils/deriveWeightGoal'
import { weightGoalProgress } from '@/shared/utils/nutrition'
import type { Patient } from '@/modules/patient/types/patient'
import type { TargetWeightFormData } from '@/modules/patient/types/targetWeight'

export const useGoalProgress = (patientId: string, patient: Patient) => {
  const { data: records, isPending } = useGetPatientWeightRecords(patientId)
  const updatePatient = useUpdatePatient()
  const [modalOpen, setModalOpen] = useState(false)

  const saveTarget = (data: TargetWeightFormData) => {
    updatePatient.mutate(
      { targetWeight: data.targetWeight },
      { onSuccess: () => setModalOpen(false) },
    )
  }

  // records vêm ordenados por data desc — [0] é o mais recente, último é o inicial
  const current = records?.[0]?.weight ?? null
  const start = records?.length ? records[records.length - 1].weight : null
  const target = patient.targetWeight

  const hasGoal = target !== null
  const hasWeight = current !== null && start !== null

  const progress = hasGoal && hasWeight ? weightGoalProgress(start, current, target) : 0
  const goal = hasGoal && current !== null ? deriveWeightGoal(current, target) : null

  return {
    isPending,
    current,
    start,
    target,
    hasGoal,
    hasWeight,
    progress,
    goal,
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    saveTarget,
    isSaving: updatePatient.isPending,
  }
}
