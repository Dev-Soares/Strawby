import { useState } from 'react'
import { Stethoscope, UserCirclePlus, UserCircleMinus, CaretRight } from '@phosphor-icons/react'
import { useDisconnectNutritionist } from '@/modules/nutritionist/hooks/useDisconnectNutritionist'
import { useMakeConnectionRequest } from '@/modules/connection-request/hooks/useMakeConnectionRequest'
import AddNutritionistModal from '@/modules/connection-request/components/AddNutritionistModal'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'

interface Patient {
  nutritionistId: string | null
  nutritionist?: { user: { name: string } } | null
}

interface Props {
  patient: Patient
}

export default function ProfileNutritionistSection({ patient }: Props) {
  const disconnectMutation = useDisconnectNutritionist()
  const makeRequestMutation = useMakeConnectionRequest()
  const [addOpen, setAddOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <section className="mb-5">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Nutricionista
        </p>
      </div>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
        {patient.nutritionistId ? (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                <Stethoscope size={15} weight="bold" className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Nutricionista atual</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                  {patient.nutritionist?.user.name ?? '—'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={disconnectMutation.isPending}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-red-100 dark:group-hover:bg-red-950/40 flex items-center justify-center shrink-0 transition-colors duration-200">
                <UserCircleMinus size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
              </div>
              <span className="flex-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 text-left transition-colors duration-200">
                {disconnectMutation.isPending ? 'Removendo…' : 'Remover nutricionista'}
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <UserCirclePlus size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <span className="flex-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 text-left">
              Adicionar nutricionista
            </span>
            <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 shrink-0" />
          </button>
        )}
      </div>

      <AddNutritionistModal
        isOpen={addOpen}
        isPending={makeRequestMutation.isPending}
        onClose={() => setAddOpen(false)}
        onSend={(code) => makeRequestMutation.mutate(code, { onSuccess: () => setAddOpen(false) })}
      />

      <ConfirmDeleteModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => disconnectMutation.mutate(undefined, { onSuccess: () => setConfirmOpen(false) })}
        isPending={disconnectMutation.isPending}
        title="Remover nutricionista?"
        description="Você perderá acesso ao plano alimentar atual. Esta ação não pode ser desfeita."
        confirmLabel="Remover"
      />
    </section>
  )
}
