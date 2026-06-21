import { LockKey } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'

interface Props {
  email: string
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ResetPasswordConfirmModal({ email, isPending, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors duration-300">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <LockKey size={20} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Redefinir senha
            </h2>
            <p className="text-[11px] font-semibold text-neutral-400">Confirme para continuar</p>
          </div>
        </div>

        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 transition-colors duration-300">
          Enviaremos um código de verificação para{' '}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{email}</span>.
          Use-o para criar uma nova senha.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-700 dark:hover:bg-neutral-300 text-white dark:text-neutral-900 text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending && <Spinner size={14} className="border-white/30 dark:border-neutral-900/30 border-t-white dark:border-t-neutral-900" />}
            {isPending ? 'Enviando…' : 'Enviar código'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}
