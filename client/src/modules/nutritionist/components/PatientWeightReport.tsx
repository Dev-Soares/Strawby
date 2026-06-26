import { Scales } from '@phosphor-icons/react'
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

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
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

export default function PatientWeightReport({ patientId }: Props) {
  const { data: records, isPending } = useGetPatientWeightRecords(patientId)

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

  return (
    <section className="mb-5">
      <div className="px-1 mb-4">
        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Histórico de peso
        </h2>
        <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          Evolução do paciente nos últimos meses
        </p>
      </div>

      <div className="flex items-center gap-4 px-4 py-4 rounded-2xl mb-1">
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

      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 pt-5">
        {isPending ? (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-24 rounded bg-neutral-800" />
            <div className="h-32 rounded bg-neutral-800" />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={['auto', 'auto']}
                    tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="date"
                    tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff06' }} />
                  <Bar dataKey="weight" radius={[0, 2, 2, 0]}>
                    <LabelList
                      dataKey="weight"
                      position="right"
                      style={{ fill: '#ffffff', fontSize: 11, fontWeight: 700 }}
                    />
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? '#ef4444' : '#3f1010'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
