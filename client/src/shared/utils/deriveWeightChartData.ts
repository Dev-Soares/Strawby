import type { WeightRecord } from '@/modules/patient/service/getPatientWeightRecordsService'

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
