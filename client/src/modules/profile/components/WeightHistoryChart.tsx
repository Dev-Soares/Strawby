import { useState } from 'react'
import { Plus, PencilSimple, ClockCounterClockwise } from '@phosphor-icons/react'
import { useGetPatientWeightRecords } from '@/modules/patient/hooks/useGetPatientWeightRecords'
import { useCreatePatientWeight } from '@/modules/patient/hooks/useCreatePatientWeight'
import { useUpdatePatientWeight } from '@/modules/patient/hooks/useUpdatePatientWeight'
import WeightRecordModal from './WeightRecordModal'
import WeightHistoryModal from './WeightHistoryModal'
import type { WeightRecordFormData } from '@/modules/patient/types/weightRecord'
import { toLocalISODate } from '@/shared/utils/date'
import WeightBarChart, { deriveWeightChartData } from '@/shared/components/WeightBarChart'
import CurrentWeightBadge from '@/shared/components/CurrentWeightBadge'

interface Props {
  patientId: string
}

export default function WeightHistoryChart({ patientId }: Props) {
  const { data: records, isPending } = useGetPatientWeightRecords(patientId)
  const createMutation = useCreatePatientWeight(patientId)
  const updateMutation = useUpdatePatientWeight(patientId)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const { latestWeight } = deriveWeightChartData(records)

  function handleCreate(data: WeightRecordFormData) {
    createMutation.mutate(
      { weight: data.weight, date: toLocalISODate() },
      { onSuccess: () => setCreateOpen(false) },
    )
  }

  function handleEdit(data: WeightRecordFormData) {
    if (!records?.[0]) return
    updateMutation.mutate(
      { recordId: records[0].id, data: { weight: data.weight } },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  return (
    <section className="mb-5">
      <div className="px-1 mb-4">
        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Histórico de peso
        </h2>
        <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          Sua evolução nos últimos meses
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 rounded-2xl mb-1">
        <CurrentWeightBadge latestWeight={latestWeight} isPending={isPending} />
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Plus size={17} weight="bold" className="text-white" />
            <span className="text-sm font-bold text-white whitespace-nowrap">Adicionar novo peso</span>
          </button>
          {records && records.length > 0 && (
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <PencilSimple size={17} weight="bold" className="text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">Editar peso atual</span>
            </button>
          )}
        </div>
      </div>

      <WeightBarChart records={records} isPending={isPending} />

      {records && records.length > 0 && (
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-150 cursor-pointer"
        >
          <ClockCounterClockwise size={16} weight="bold" />
          Ver histórico
        </button>
      )}

      <WeightRecordModal
        isOpen={createOpen}
        isPending={createMutation.isPending}
        title="Adicionar peso"
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      <WeightRecordModal
        isOpen={editOpen}
        isPending={updateMutation.isPending}
        defaultWeight={records?.[0]?.weight}
        title="Editar medição"
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
      />

      <WeightHistoryModal
        isOpen={historyOpen}
        patientId={patientId}
        records={records ?? []}
        onClose={() => setHistoryOpen(false)}
      />
    </section>
  )
}
