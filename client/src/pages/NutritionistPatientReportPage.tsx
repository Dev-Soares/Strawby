import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import { useGetPatients } from '@/modules/nutritionist/hooks/useGetPatients'
import PatientWeightReport from '@/modules/nutritionist/components/PatientWeightReport'
import PatientScoreCalendar from '@/modules/nutritionist/components/PatientScoreCalendar'

export default function NutritionistPatientReportPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const { data: patients } = useGetPatients()
  const patient = patients?.find((p) => p.id === patientId)

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-16 max-w-3xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() => navigate('/app/nutritionist/results')}
            className="flex items-center gap-2 mb-5 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} weight="bold" />
            Resultados
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 transition-colors duration-300">
              <User size={20} weight="bold" className="text-red-500" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight truncate min-w-0">
              {patient?.user.name ?? '—'}
            </h1>
          </div>
        </motion.div>

        {patientId && (
          <>
            <PatientWeightReport patientId={patientId} />

            <hr className="border-neutral-100 dark:border-neutral-800 my-8 transition-colors duration-300" />

            <PatientScoreCalendar patientId={patientId} />
          </>
        )}
      </div>
    </AppLayout>
  )
}
