import { useDeleteUser } from '@/modules/auth/hooks/useDeleteUser'
import { Warning } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'

interface Props {
  userId: string
  onClose: () => void
}

export default function DeleteAccountModal({ userId, onClose }: Props) {
  const deleteUser = useDeleteUser()

  const handleConfirm = () => {
    deleteUser.mutate(userId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <Warning size={20} weight="fill" className="text-red-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Deletar conta
            </h2>
            <p className="text-[11px] font-semibold text-neutral-400">Ação irreversível</p>
          </div>
        </div>

        <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 transition-colors duration-300">
          Todos os seus dados serão apagados permanentemente — refeições, receitas, histórico e planos. Não há como desfazer.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteUser.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {deleteUser.isPending && <Spinner size={14} />}
            {deleteUser.isPending ? 'Deletando…' : 'Sim, deletar minha conta'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={deleteUser.isPending}
            className="w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
