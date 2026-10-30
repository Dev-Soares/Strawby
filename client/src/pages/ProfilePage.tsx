import { motion } from 'framer-motion'
import AppLayout from '@/shared/layouts/AppLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useGetPatient } from '@/modules/patient/hooks/useGetPatient'
import ProfileInviteCodeSection from '@/modules/profile/components/ProfileInviteCodeSection'
import ProfileNutritionistSection from '@/modules/profile/components/ProfileNutritionistSection'
import ProfileBodyDataSection from '@/modules/profile/components/ProfileBodyDataSection'
import GoalProgressSection from '@/modules/profile/components/GoalProgressSection'
import WeightHistoryChart from '@/modules/profile/components/WeightHistoryChart'

export default function ProfilePage() {
  const { data: user } = useAuth()

  const isNutritionist = user?.role === 'nutritionist'
  const isPatient = user?.role === 'patient'

  const { data: patient } = useGetPatient(isPatient ? (user?.id ?? '') : '')

  return (
    <AppLayout>
      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8 sm:py-12">

        <motion.div
          data-tutorial="profile-header"
          className="mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
            Meu perfil
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 transition-colors duration-300">
            {isNutritionist
              ? 'Sua identidade e o código que conecta seus pacientes'
              : 'Seus dados, sua meta e sua evolução'}
          </p>
        </motion.div>

        {isPatient && (
          <>
            {user?.patient && <ProfileNutritionistSection patient={user.patient} />}

            <hr className="my-12 border-neutral-100 dark:border-neutral-800 transition-colors duration-300" />

            {/* Colunas empilham independente — evita buraco entre seções de alturas diferentes */}
            {/* Mobile: peso → meta → métricas. Desktop: meta+métricas à esquerda, peso à direita */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-14 items-start">
              <WeightHistoryChart patientId={user!.id} />

              <div className="flex flex-col gap-12 lg:order-first">
                {patient && <GoalProgressSection patientId={user!.id} patient={patient} />}
                {patient && <ProfileBodyDataSection patient={patient} />}
              </div>
            </div>
          </>
        )}

        {isNutritionist && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-x-14 items-start">
            <ProfileInviteCodeSection />
          </div>
        )}

      </div>
    </AppLayout>
  )
}
