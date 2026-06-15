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

const MOCK_DATA = [
  { date: '02/04', weight: 69.0 },
  { date: '26/03', weight: 69.4 },
  { date: '19/03', weight: 71.0 },
  { date: '12/03', weight: 72.8 },
  { date: '05/03', weight: 75.2 },
  { date: '26/02', weight: 77.6 },
  { date: '19/02', weight: 80.1 },
  { date: '12/02', weight: 83.4 },
  { date: '05/02', weight: 86.0 },
  { date: '29/01', weight: 89.3 },
  { date: '22/01', weight: 91.8 },
  { date: '15/01', weight: 94.1 },
  { date: '08/01', weight: 96.5 },
  { date: '01/01', weight: 98.2 },
]

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

interface Props {
  weight: number | null
}

export default function WeightHistoryChart({ weight }: Props) {
  const latestWeight = MOCK_DATA[0].weight
  const oldestWeight = MOCK_DATA[MOCK_DATA.length - 1].weight
  const delta = (latestWeight - oldestWeight).toFixed(1)
  const lost = parseFloat(delta) < 0

  const chartHeight = MOCK_DATA.length * 42

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

      <button
        type="button"
        className="flex items-center gap-4 px-4 py-4 w-full rounded-2xl hover:bg-blue-50/60 dark:hover:bg-blue-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left mb-1"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-200 dark:shadow-blue-950/40">
          <Scales size={22} weight="bold" className="text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-0.5">Peso atual</p>
          <div className="flex items-baseline gap-1 leading-none">
            <span className="font-display text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {weight ?? '—'}
            </span>
            {weight !== null && (
              <span className="text-sm font-bold text-blue-400 dark:text-blue-500">kg</span>
            )}
          </div>
        </div>
      </button>

      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 pt-5">
        <div className="mb-5 px-1">
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Variação total</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-extrabold text-red-400">
              {lost ? delta : `+${delta}`}
            </span>
            <span className="text-sm font-bold text-red-500">kg</span>
          </div>
        </div>

        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={MOCK_DATA}
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
                {MOCK_DATA.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === MOCK_DATA.length - 1 ? '#ef4444' : '#3f1010'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
