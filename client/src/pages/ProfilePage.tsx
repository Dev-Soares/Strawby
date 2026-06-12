import { SignOutIcon } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import ProfileAvatar from '@/modules/profile/components/ProfileAvatar'
import ProfileAccountSection from '@/modules/profile/components/ProfileAccountSection'
import ProfileInviteCodeSection from '@/modules/profile/components/ProfileInviteCodeSection'
import ProfileNutritionistSection from '@/modules/profile/components/ProfileNutritionistSection'
import ProfileBodyDataSection from '@/modules/profile/components/ProfileBodyDataSection'
import ProfileThemeSection from '@/modules/profile/components/ProfileThemeSection'
import ProfileSupportSection from '@/modules/profile/components/ProfileSupportSection'
import ProfileNotificationsSection from '@/modules/notifications/components/ProfileNotificationsSection'

export default function ProfilePage() {
  const { data: user } = useAuth()
  const signOut = useSignOut()

  const isNutritionist = user?.role === 'nutritionist'
  const isPatient = user?.role === 'patient'
  const patient = user?.patient ?? null

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 max-w-2xl mx-auto">

        <ProfileAvatar name={user?.name ?? '—'} />

        <ProfileAccountSection id={user?.id ?? ''} name={user?.name ?? '—'} email={user?.email ?? '—'} />

        {isNutritionist && <ProfileInviteCodeSection />}

        {isPatient && patient && <ProfileNutritionistSection patient={patient} />}

        {isPatient && patient && <ProfileBodyDataSection patient={patient} />}

        <ProfileThemeSection />

        <ProfileNotificationsSection />

        <ProfileSupportSection />

        <button
          type="button"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer shadow-sm"
        >
          {signOut.isPending ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <SignOutIcon size={17} weight="bold" />
          )}
          {signOut.isPending ? 'Saindo…' : 'Sair da conta'}
        </button>

      </div>
    </AppLayout>
  )
}
