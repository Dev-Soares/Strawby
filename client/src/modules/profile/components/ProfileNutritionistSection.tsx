import { useState } from 'react'
import { Stethoscope, Trash, Plus } from '@phosphor-icons/react'
import { useDisconnectNutritionist } from '@/modules/nutritionist/hooks/useDisconnectNutritionist'
import { useMakeConnectionRequest } from '@/modules/connection-request/hooks/useMakeConnectionRequest'
import AddNutritionistModal from '@/modules/connection-request/components/AddNutritionistModal'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import Spinner from '@/shared/components/Spinner'

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
      <div className="mb-5 px-1">
        <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Seu nutricionista
        </h2>
        <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
          {patient.nutritionistId
            ? 'Profissional vinculado ao seu plano'
            : 'Nenhum profissional vinculado ainda'}
        </p>
      </div>

      {patient.nutritionistId ? (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-md shadow-red-950/40">
              <Stethoscope size={26} weight="bold" className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-extrabold text-neutral-900 dark:text-white truncate leading-tight transition-colors duration-300">
                {patient.nutritionist?.user.name ?? '—'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={disconnectMutation.isPending}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.97] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {disconnectMutation.isPending ? <Spinner size={15} /> : <Trash size={15} weight="bold" />}
            {disconnectMutation.isPending ? 'Removendo…' : 'Remover'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.97] transition-all duration-150 cursor-pointer px-5 py-4"
        >
          <Plus size={20} weight="bold" className="text-white shrink-0" />
          <p className="text-sm font-extrabold text-white">
            Adicionar nutricionista
          </p>
        </button>
      )}

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
