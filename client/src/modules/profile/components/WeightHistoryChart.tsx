import { useState } from 'react'
import { motion } from 'framer-motion'
import { History, Pencil, Plus, Scale } from 'lucide-react'
import { useGetPatientWeightRecords } from '@/modules/patient/hooks/useGetPatientWeightRecords'
import { useCreatePatientWeight } from '@/modules/patient/hooks/useCreatePatientWeight'
import { useUpdatePatientWeight } from '@/modules/patient/hooks/useUpdatePatientWeight'
import WeightRecordModal from './WeightRecordModal'
import WeightHistoryModal from './WeightHistoryModal'
import type { WeightRecordFormData } from '@/modules/patient/types/weightRecord'
import { toLocalISODate } from '@/shared/utils/date'
import WeightBarChart, { deriveWeightChartData } from '@/shared/components/WeightBarChart'
import { PROFILE_ACCENTS } from '../config/profileAccents'

const { color, track } = PROFILE_ACCENTS.brand

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
  const hasRecords = !!records && records.length > 0

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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: track }}
        >
          <Scale size={18} style={{ color }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color }}>
          Histórico de peso
        </span>

        {hasRecords && (
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Pencil size={14} />
            Editar
          </button>
        )}
      </div>

      <p className="mb-1 text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
        Peso atual
      </p>

      <div className="flex items-baseline gap-2">
        {isPending ? (
          <div className="h-10 w-28 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        ) : (
          <>
            <span
              className="font-display text-4xl font-extrabold leading-none tabular-nums tracking-tight"
              style={{ color }}
            >
              {latestWeight ?? '—'}
            </span>
            {latestWeight !== null && (
              <span className="text-sm font-semibold" style={{ color }}>
                kg
              </span>
            )}
          </>
        )}
      </div>

      <p className="mt-3 mb-6 text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
        Evolução das últimas medições.
      </p>

      <WeightBarChart records={records} isPending={isPending} bare />

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <Plus size={17} className="text-white" />
          <span className="text-sm font-bold text-white whitespace-nowrap">Registrar peso</span>
        </button>

        {hasRecords && (
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 py-3 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <History size={16} />
            <span className="whitespace-nowrap">Ver histórico</span>
          </button>
        )}
      </div>

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
    </motion.section>
  )
}
