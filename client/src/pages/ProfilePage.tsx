import AppLayout from '@/shared/layouts/AppLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import ProfileAvatar from '@/modules/profile/components/ProfileAvatar'
import ProfileInviteCodeSection from '@/modules/profile/components/ProfileInviteCodeSection'
import ProfileNutritionistSection from '@/modules/profile/components/ProfileNutritionistSection'
import ProfileBodyDataSection from '@/modules/profile/components/ProfileBodyDataSection'

export default function ProfilePage() {
  const { data: user } = useAuth()

  const isNutritionist = user?.role === 'nutritionist'
  const isPatient = user?.role === 'patient'
  const patient = user?.patient ?? null

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 max-w-2xl mx-auto">

        <ProfileAvatar name={user?.name ?? '—'} email={user?.email} role={user?.role} />

        {isNutritionist && <ProfileInviteCodeSection />}

        {isPatient && patient && <ProfileNutritionistSection patient={patient} />}

        {isPatient && patient && <ProfileBodyDataSection patient={patient} />}

      </div>
    </AppLayout>
  )
}
