import AppLayout from '../../../shared/layouts/AppLayout'
import NutritionistHeader from './NutritionistHeader'
import PatientList from './PatientList'
import PatientListSkeleton from '../skeletons/PatientListSkeleton'
import { useGetPatients } from '../hooks/useGetPatients'
import { useAuth } from '../../auth/hooks/useAuth'

export default function NutritionistContent() {
  const { data: user } = useAuth()
  const { data: patients, isPending: patientsPending, isError: patientsError } = useGetPatients()

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-16 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-red-50/40 dark:from-red-950/20 via-neutral-50 dark:via-neutral-950 to-neutral-50 dark:to-neutral-950 min-h-screen transition-colors duration-300">

        <NutritionistHeader name={user?.name ?? 'Nutricionista'} />

        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight transition-colors duration-300">
            Meus pacientes
          </h2>
          {!patientsPending && patients && (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
              {patients.length} {patients.length === 1 ? 'paciente vinculado' : 'pacientes vinculados'}
            </p>
          )}
        </div>

        {patientsError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 p-4 mb-6 transition-colors duration-300">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Erro ao carregar pacientes</p>
          </div>
        )}

        {patientsPending ? (
          <PatientListSkeleton />
        ) : (
          <PatientList patients={patients ?? []} />
        )}
      </div>
    </AppLayout>
  )
}
