import { useGetPatientWeightRecords } from '@/modules/patient/hooks/useGetPatientWeightRecords'
import WeightBarChart, { deriveWeightChartData } from '@/shared/components/WeightBarChart'
import CurrentWeightBadge from '@/shared/components/CurrentWeightBadge'

interface Props {
  patientId: string
}

export default function PatientWeightReport({ patientId }: Props) {
  const { data: records, isPending } = useGetPatientWeightRecords(patientId)
  const { latestWeight } = deriveWeightChartData(records)

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
        <CurrentWeightBadge latestWeight={latestWeight} isPending={isPending} />
      </div>

      <WeightBarChart records={records} isPending={isPending} />
    </section>
  )
}
