import { useState } from 'react'
import { EnvelopeSimple, Calendar, PencilSimple, Trash, LockKey } from '@phosphor-icons/react'
import { useUpdateUser } from '@/modules/auth/hooks/useUpdateUser'
import { useSendResetPasswordEmail } from '@/modules/auth/hooks/useSendResetPasswordEmail'
import DeleteAccountModal from './DeleteAccountModal'
import ResetPasswordConfirmModal from './ResetPasswordConfirmModal'
import Spinner from '@/shared/components/Spinner'

interface Props {
  id: string
  name: string
  email: string
}

export default function ProfileAccountSection({ id, name, email }: Props) {
  const updateUser = useUpdateUser()
  const sendResetPasswordEmail = useSendResetPasswordEmail(email)
  const [editing, setEditing] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleSave = () => {
    if (nameValue.trim().length >= 2)
      updateUser.mutate({ name: nameValue.trim() }, { onSuccess: () => setEditing(false) })
  }

  return (
    <section className="mb-5">
      <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
        Conta
      </p>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">

        {/* Nome editável */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <PencilSimple size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">Nome</p>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') setEditing(false)
                  }}
                  className="flex-1 min-w-0 text-sm font-semibold text-neutral-800 dark:text-neutral-100 bg-transparent border-b border-red-500 outline-none pb-0.5"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updateUser.isPending || nameValue.trim().length < 2}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-xl disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                >
                  {updateUser.isPending && <Spinner size={13} />}
                  {updateUser.isPending ? 'Salvando…' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-xs font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 px-2 py-2 transition-colors cursor-pointer shrink-0"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 block truncate">
                {name}
              </span>
            )}
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => { setNameValue(name); setEditing(true) }}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <PencilSimple size={14} weight="bold" />
              Editar
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <EnvelopeSimple size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">E-mail</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <Calendar size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Membro desde</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-3 px-5 py-4 w-full text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150 cursor-pointer border-b border-neutral-100 dark:border-neutral-800"
        >
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <LockKey size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            Redefinir senha
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-3 px-5 py-4 w-full text-left hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-150 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <Trash size={15} weight="bold" className="text-red-600" />
          </div>
          <span className="text-sm font-semibold text-red-600">Deletar conta</span>
        </button>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          userId={id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {showResetConfirm && (
        <ResetPasswordConfirmModal
          email={email}
          isPending={sendResetPasswordEmail.isPending}
          onConfirm={() => sendResetPasswordEmail.mutate()}
          onClose={() => setShowResetConfirm(false)}
        />
      )}
    </section>
  )
}
