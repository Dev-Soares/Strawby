import { useState } from 'react'
import { Bell } from '@phosphor-icons/react'
import NotificationPermissionPopup from './NotificationPermissionPopup'

export default function ProfileNotificationsSection() {
  const isEnabled =
    'Notification' in window &&
    Notification.permission === 'granted' &&
    !!localStorage.getItem('fcm_token')

  const isDenied = 'Notification' in window && Notification.permission === 'denied'

  const [enabled, setEnabled] = useState(isEnabled)
  const [popupOpen, setPopupOpen] = useState(false)

  if (enabled || isDenied) return null

  return (
    <section className="mb-5">
      <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
        Notificações
      </p>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <Bell size={15} weight="bold" className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Push notifications
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Receba lembretes de refeições e atualizações.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPopupOpen(true)}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 cursor-pointer"
        >
          Ativar notificações
        </button>
      </div>

      <NotificationPermissionPopup
        forceOpen={popupOpen}
        onClose={() => {
          setPopupOpen(false)
          const nowEnabled =
            'Notification' in window &&
            Notification.permission === 'granted' &&
            !!localStorage.getItem('fcm_token')
          setEnabled(nowEnabled)
        }}
      />
    </section>
  )
}
