import { useState } from 'react'
import { Scales, Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { useGetPatientWeightRecords } from '@/modules/patient/hooks/useGetPatientWeightRecords'
import { useCreatePatientWeight } from '@/modules/patient/hooks/useCreatePatientWeight'
import { useUpdatePatientWeight } from '@/modules/patient/hooks/useUpdatePatientWeight'
import { useDeletePatientWeight } from '@/modules/patient/hooks/useDeletePatientWeight'
import WeightRecordModal from './WeightRecordModal'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import type { WeightRecordFormData } from '@/modules/patient/types/weightRecord'
import { toLocalISODate } from '@/shared/utils/date'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-xl font-extrabold text-red-400">{payload[0].value}</span>
        <span className="text-xs font-bold text-red-500">kg</span>
      </div>
    </div>
  )
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

interface Props {
  patientId: string
}

export default function WeightHistoryChart({ patientId }: Props) {
  const { data: records, isPending } = useGetPatientWeightRecords(patientId)
  const createMutation = useCreatePatientWeight(patientId)
  const updateMutation = useUpdatePatientWeight(patientId)
  const deleteMutation = useDeletePatientWeight(patientId)
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const chartData = (records ?? []).map((r) => ({
    date: formatDate(r.date),
    weight: r.weight,
  }))

  const latestWeight = chartData[0]?.weight ?? null
  const oldestWeight = chartData[chartData.length - 1]?.weight ?? null
  const delta =
    latestWeight !== null && oldestWeight !== null
      ? (latestWeight - oldestWeight).toFixed(1)
      : null
  const lost = delta !== null && parseFloat(delta) < 0

  const chartHeight = Math.max(chartData.length * 42, 80)

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

  function handleDelete() {
    if (!records?.[0]) return
    deleteMutation.mutate(records[0].id, { onSuccess: () => setDeleteOpen(false) })
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
            <Scales size={22} weight="bold" className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-red-400 dark:text-red-500 uppercase tracking-widest mb-0.5">
              Peso atual
            </p>
            <div className="flex items-baseline gap-1 leading-none">
              {isPending ? (
                <div className="h-8 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
              ) : (
                <>
                  <span className="font-display text-3xl font-extrabold text-red-600 dark:text-red-400">
                    {latestWeight ?? '—'}
                  </span>
                  {latestWeight !== null && (
                    <span className="text-sm font-bold text-red-400 dark:text-red-500">kg</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
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
            <>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <PencilSimple size={17} weight="bold" className="text-neutral-600 dark:text-neutral-400" />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">Editar peso atual</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                title="Remover peso atual"
                className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-500 hover:text-red-500 active:scale-[0.98] transition-all duration-150 cursor-pointer shrink-0"
              >
                <Trash size={17} weight="bold" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 pt-5 transition-colors duration-300">
        {isPending ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-24 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-32 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-sm font-medium text-neutral-500 text-center py-6">
            Nenhum registro de peso ainda
          </p>
        ) : (
          <>
            {delta !== null && (
              <div className="mb-5 px-1">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">
                  Variação total
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-extrabold text-red-400">
                    {lost ? delta : `+${delta}`}
                  </span>
                  <span className="text-sm font-bold text-red-500">kg</span>
                </div>
              </div>
            )}

            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#e5e5e5'} horizontal={false} />
                  <XAxis
                    type="number"
                    domain={['auto', 'auto']}
                    tick={{ fill: isDark ? '#ffffff' : '#171717', fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="date"
                    tick={{ fill: isDark ? '#ffffff' : '#171717', fontSize: 12, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#ffffff06' : '#00000008' }} />
                  <Bar dataKey="weight" radius={[0, 2, 2, 0]}>
                    <LabelList
                      dataKey="weight"
                      position="right"
                      style={{ fill: isDark ? '#ffffff' : '#171717', fontSize: 11, fontWeight: 700 }}
                    />
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? '#ef4444' : isDark ? '#3f1010' : '#fecaca'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
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

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Remover peso atual?"
        description="O registro de peso mais recente será removido permanentemente."
        confirmLabel="Remover"
      />
    </section>
  )
}
