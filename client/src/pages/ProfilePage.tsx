import { motion } from 'framer-motion'
import AppLayout from '@/shared/layouts/AppLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useGetPatient } from '@/modules/patient/hooks/useGetPatient'
import ProfileInviteCodeSection from '@/modules/profile/components/ProfileInviteCodeSection'
import ProfileNutritionistSection from '@/modules/profile/components/ProfileNutritionistSection'
import ProfileBodyDataSection from '@/modules/profile/components/ProfileBodyDataSection'
import WeightHistoryChart from '@/modules/profile/components/WeightHistoryChart'

export default function ProfilePage() {
  const { data: user } = useAuth()

  const isNutritionist = user?.role === 'nutritionist'
  const isPatient = user?.role === 'patient'

  const { data: patient } = useGetPatient(isPatient ? (user?.id ?? '') : '')

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 sm:py-10 lg:py-12 transition-colors duration-300">

        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight transition-colors duration-300">
            Seu perfil
          </h1>
        </motion.div>

        {isPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-start">
            <div className="lg:pr-16 lg:border-r border-neutral-100 dark:border-neutral-800">
              {user?.patient && <ProfileNutritionistSection patient={user.patient} />}
              <hr className="border-neutral-100 dark:border-neutral-800 my-8 transition-colors duration-300" />
              {patient && <ProfileBodyDataSection patient={patient} />}
            </div>
            <div className="lg:pl-16">
              <WeightHistoryChart patientId={user!.id} />
            </div>
          </div>
        )}

        {isNutritionist && (
          <ProfileInviteCodeSection />
        )}

      </div>
    </AppLayout>
  )
}
