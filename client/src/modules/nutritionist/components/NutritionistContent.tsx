import { useState } from 'react'
import AppLayout from '../../../shared/layouts/AppLayout'
import NutritionistHeader from './NutritionistHeader'
import PatientList from './PatientList'
import PatientListSkeleton from '../skeletons/PatientListSkeleton'
import ConnectionRequestCard from '../../connection-request/components/ConnectionRequestCard'
import ConnectionRequestCardSkeleton from '../../connection-request/skeletons/ConnectionRequestCardSkeleton'
import { useGetPatients } from '../hooks/useGetPatients'
import { useGetConnectionRequests } from '../../connection-request/hooks/useGetConnectionRequests'
import { useAcceptConnectionRequest } from '../../connection-request/hooks/useAcceptConnectionRequest'
import { useRejectConnectionRequest } from '../../connection-request/hooks/useRejectConnectionRequest'
import { useAuth } from '../../auth/hooks/useAuth'
import { useAutoTutorial } from '../../onboarding/hooks/useTutorial'

type Tab = 'patients' | 'requests'

export default function NutritionistContent() {
  const [activeTab, setActiveTab] = useState<Tab>('patients')
  const { data: user } = useAuth()
  useAutoTutorial()
  const { data: patients, isPending: patientsPending, isError: patientsError } = useGetPatients()
  const { data: requests, isPending: requestsPending } = useGetConnectionRequests()
  const accept = useAcceptConnectionRequest()
  const reject = useRejectConnectionRequest()

  const pendingCount = requests?.length ?? 0

  const acceptingId = accept.isPending ? accept.variables : null
  const rejectingId = reject.isPending ? reject.variables : null

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-16 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-red-50/40 dark:from-red-950/20 via-neutral-50 dark:via-neutral-950 to-neutral-50 dark:to-neutral-950 min-h-screen transition-colors duration-300">

        <NutritionistHeader name={user?.name ?? 'Nutricionista'} />

        <div data-tutorial="patient-tabs" className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl w-fit mb-6 transition-colors duration-300">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'patients'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            Pacientes
            {!patientsPending && patients && (
              <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500">{patients.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            Solicitações
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'patients' && (
          <>
            <div data-tutorial="patient-list" className="mb-5">
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

            {patientsPending ? <PatientListSkeleton /> : <PatientList patients={patients ?? []} />}
          </>
        )}

{activeTab === 'requests' && (
          <>
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight transition-colors duration-300">
                Solicitações pendentes
              </h2>
              {!requestsPending && (
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                  {pendingCount} {pendingCount === 1 ? 'solicitação aguardando' : 'solicitações aguardando'}
                </p>
              )}
            </div>

            {requestsPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ConnectionRequestCardSkeleton key={i} />
                ))}
              </div>
            ) : pendingCount === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-8 text-center transition-colors duration-300">
                <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">
                  Nenhuma solicitação pendente
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests!.map((request, i) => (
                  <ConnectionRequestCard
                    key={request.id}
                    request={request}
                    index={i}
                    onAccept={accept.mutate}
                    onReject={reject.mutate}
                    isAccepting={acceptingId === request.id}
                    isRejecting={rejectingId === request.id}
                    disabled={!!acceptingId || !!rejectingId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
