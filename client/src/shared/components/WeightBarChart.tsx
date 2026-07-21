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
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import type { WeightRecord } from '@/modules/patient/service/getPatientWeightRecordsService'

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

export function deriveWeightChartData(records: WeightRecord[] | undefined) {
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

  return { chartData, latestWeight, delta, lost }
}

interface WeightBarChartProps {
  records: WeightRecord[] | undefined
  isPending: boolean
}

export default function WeightBarChart({ records, isPending }: WeightBarChartProps) {
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  const { chartData, delta, lost } = deriveWeightChartData(records)
  const chartHeight = Math.max(chartData.length * 42, 80)

  return (
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
  )
}
