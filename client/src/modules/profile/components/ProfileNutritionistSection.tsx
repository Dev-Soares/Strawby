import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Stethoscope, Trash2 } from 'lucide-react'
import { useDisconnectNutritionist } from '@/modules/nutritionist/hooks/useDisconnectNutritionist'
import { useMakeConnectionRequest } from '@/modules/connection-request/hooks/useMakeConnectionRequest'
import AddNutritionistModal from '@/modules/connection-request/components/AddNutritionistModal'
import MyConnectionRequests from '@/modules/connection-request/components/MyConnectionRequests'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import Spinner from '@/shared/components/Spinner'
import { PROFILE_ACCENTS } from '../config/profileAccents'

const { color, track } = PROFILE_ACCENTS.nutritionist

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

  const isConnected = patient.nutritionistId !== null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: track }}
        >
          <Stethoscope size={18} style={{ color }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color }}>
          Seu nutricionista
        </span>

        {isConnected && (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={disconnectMutation.isPending}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {disconnectMutation.isPending ? <Spinner size={13} /> : <Trash2 size={14} />}
            {disconnectMutation.isPending ? 'Removendo…' : 'Remover'}
          </button>
        )}
      </div>

      {isConnected ? (
        <p className="truncate font-display text-2xl sm:text-3xl font-extrabold leading-none tracking-tight text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
          {patient.nutritionist?.user.name ?? '—'}
        </p>
      ) : (
        <>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Nenhum profissional vinculado. Use o código do seu nutricionista para receber o plano
            aqui.
          </p>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 active:scale-[0.98] transition-all duration-150 cursor-pointer sm:w-auto sm:px-6"
          >
            <Plus size={17} className="text-white" />
            <span className="text-sm font-bold text-white">Adicionar nutricionista</span>
          </button>

          <MyConnectionRequests />
        </>
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
    </motion.section>
  )
}
