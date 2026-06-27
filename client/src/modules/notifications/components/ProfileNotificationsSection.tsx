import { useState } from 'react'
import { Bell } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { useRequestNotificationPermission } from '../hooks/useRequestNotificationPermission'
import { useDisableNotifications } from '../hooks/useDisableNotifications'

const getIsEnabled = () =>
  'Notification' in window &&
  Notification.permission === 'granted' &&
  !!localStorage.getItem('fcm_token')

export default function ProfileNotificationsSection() {
  
  const [enabled, setEnabled] = useState(getIsEnabled)

  const { mutate: enable, isPending: isEnabling } = useRequestNotificationPermission()
  const { mutate: disable, isPending: isDisabling } = useDisableNotifications()

  if (!('Notification' in window)) return null
   const isDenied = Notification.permission === 'denied'

  const isPending = isEnabling || isDisabling

  const handleToggle = () => {
    if (isPending || isDenied) return

    if (enabled) {
      disable(undefined, {
        onSuccess: () => setEnabled(false),
        onError: () => toast.error('Erro ao desativar notificações.'),
      })
    } else {
      enable(undefined, {
        onSuccess: (token) => {
          if (token) setEnabled(true)
        },
        onError: (error) => {
          console.error('Erro ao ativar notificações:', error)
          toast.error('Erro ao ativar notificações. Tente novamente.')
        },
      })
    }
  }

  return (
    <section className="mb-5">
      <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
        Notificações
      </p>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <Bell size={15} weight="bold" className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Push notifications
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isDenied
                ? 'Bloqueado pelo navegador. Altere nas configurações.'
                : 'Receba lembretes de refeições e atualizações.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={handleToggle}
            disabled={isPending || isDenied}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              enabled ? 'bg-red-600' : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  )
}
