import { useState } from 'react'
import { SignOutIcon } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import ProfileAccountSection from '@/modules/profile/components/ProfileAccountSection'
import ProfileThemeSection from '@/modules/profile/components/ProfileThemeSection'
import ProfileSupportSection from '@/modules/profile/components/ProfileSupportSection'
import ProfileNotificationsSection from '@/modules/notifications/components/ProfileNotificationsSection'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export default function SettingsPage() {
  const { data: user } = useAuth()
  const signOut = useSignOut()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 max-w-2xl mx-auto">

        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-8 transition-colors duration-300">
          Ajustes
        </h1>

        <ProfileAccountSection id={user?.id ?? ''} name={user?.name ?? '—'} email={user?.email ?? '—'} />

        <ProfileThemeSection />

        <ProfileNotificationsSection />

        <ProfileSupportSection />

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
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

        <ConfirmDeleteModal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => signOut.mutate()}
          isPending={signOut.isPending}
          title="Sair da conta?"
          description="Você será desconectado e precisará fazer login novamente para acessar o app."
          confirmLabel="Sair"
        />

      </div>
    </AppLayout>
  )
}
