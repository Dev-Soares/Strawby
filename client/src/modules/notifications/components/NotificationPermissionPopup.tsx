import { useEffect, useState } from 'react'
import { Bell, X } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { useRequestNotificationPermission } from '../hooks/useRequestNotificationPermission'
import Spinner from '../../../shared/components/Spinner'

const STORAGE_KEY = 'notification_permission_asked'

interface NotificationPermissionPopupProps {
  forceOpen?: boolean
  onClose?: () => void
}

const NotificationPermissionPopup = ({ forceOpen, onClose }: NotificationPermissionPopupProps = {}) => {
  const [visible, setVisible] = useState(false)
  const { mutate, isPending } = useRequestNotificationPermission()

  useEffect(() => {
    if (forceOpen) {
      setVisible(true)
      return
    }

    const permissionStatus = 'Notification' in window ? Notification.permission : 'unsupported'

    // Logo após concluir o tutorial, força a exibição (ignora o "já perguntado").
    if (sessionStorage.getItem('strawby_notif_after_tutorial')) {
      sessionStorage.removeItem('strawby_notif_after_tutorial')
      if (permissionStatus === 'default') {
        const timer = setTimeout(() => setVisible(true), 600)
        return () => clearTimeout(timer)
      }
      return
    }

    const alreadyAsked = localStorage.getItem(STORAGE_KEY)
    const tutorialPending = !!sessionStorage.getItem('strawby_show_tutorial')
    const tutorialActive = !!sessionStorage.getItem('strawby_tutorial_active')

    if (!alreadyAsked && permissionStatus === 'default' && !tutorialPending && !tutorialActive) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [forceOpen])

  // Tutorial concluído na mesma rota não remonta o layout, então ouvimos o evento.
  useEffect(() => {
    const handler = () => {
      sessionStorage.removeItem('strawby_notif_after_tutorial')
      const permissionStatus = 'Notification' in window ? Notification.permission : 'unsupported'
      if (permissionStatus === 'default') setVisible(true)
    }
    window.addEventListener('strawby:tutorial-complete', handler)
    return () => window.removeEventListener('strawby:tutorial-complete', handler)
  }, [])

  const dismiss = () => {
    if (!forceOpen) localStorage.setItem(STORAGE_KEY, 'dismissed')
    setVisible(false)
    onClose?.()
  }

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'asked')
    mutate(undefined, {
      onSuccess: () => {
        setVisible(false)
        onClose?.()
      },
      onError: () => {
        toast.error('Erro ao ativar notificações. Tente novamente.')
        setVisible(false)
        onClose?.()
      },
    })
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-24 left-0 right-0 flex justify-center px-4 z-50 fade-up-1">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
            <Bell size={18} weight="fill" className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Ativar notificações
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
              Receba lembretes de refeições, atualizações do seu plano e muito mais.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors mt-0.5"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={dismiss}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Agora não
          </button>
          <button
            onClick={handleAccept}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isPending && <Spinner size={14} />}
            {isPending ? 'Aguarde...' : 'Sim, quero!'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationPermissionPopup
