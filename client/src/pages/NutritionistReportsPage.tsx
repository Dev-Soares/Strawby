import AppLayout from '@/shared/layouts/AppLayout'
import PatientScoreCard from '@/modules/nutritionist/components/PatientScoreCard'
import PatientScoreCardSkeleton from '@/modules/nutritionist/skeletons/PatientScoreCardSkeleton'
import { useGetPatients } from '@/modules/nutritionist/hooks/useGetPatients'
import { motion } from 'framer-motion'

export default function NutritionistReportsPage() {
  const { data: patients, isPending, isError } = useGetPatients()

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-16 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-red-50/40 dark:from-red-950/20 via-neutral-50 dark:via-neutral-950 to-neutral-50 dark:to-neutral-950 min-h-screen transition-colors duration-300">

        <motion.div
          data-tutorial="reports-header"
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3 sm:mb-4 transition-colors duration-300">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^\w/, (c) => c.toUpperCase())}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight mb-2 transition-colors duration-300">
            Resultados
          </h1>
          <p className="text-lg sm:text-xl font-extrabold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Adesão ao <span className="text-red-600">plano alimentar</span>
          </p>
        </motion.div>

        <div className="mb-5">
          {!isPending && patients && (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              {patients.length} {patients.length === 1 ? 'paciente monitorado' : 'pacientes monitorados'}
            </p>
          )}
        </div>

        {isError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 p-4 mb-6 transition-colors duration-300">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Erro ao carregar pacientes</p>
          </div>
        )}

        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PatientScoreCardSkeleton key={i} />
            ))}
          </div>
        ) : !patients || patients.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-10 text-center transition-colors duration-300">
            <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">
              Nenhum paciente vinculado ainda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient, i) => (
              <PatientScoreCard key={patient.id} patient={patient} index={i} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
