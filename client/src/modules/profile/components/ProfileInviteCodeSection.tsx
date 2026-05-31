import { useState } from 'react'
import { Password, CaretRight, PencilSimple } from '@phosphor-icons/react'
import { useGetNutritionist } from '@/modules/nutritionist/hooks/useGetNutritionist'
import { useUpdateCode } from '@/modules/nutritionist/hooks/useUpdateCode'
import UpdateCodeModal from '@/modules/nutritionist/components/UpdateCodeModal'

export default function ProfileInviteCodeSection() {
  const { data: nutritionist } = useGetNutritionist()
  const updateCodeMutation = useUpdateCode()
  const [open, setOpen] = useState(false)

  return (
    <section className="mb-5">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Código de convite
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <PencilSimple size={12} weight="bold" />
          Editar
        </button>
      </div>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <Password size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Código atual</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
              {nutritionist?.code ?? 'Não definido'}
            </p>
          </div>
          <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 shrink-0" />
        </button>
      </div>

      <UpdateCodeModal
        isOpen={open}
        currentCode={nutritionist?.code ?? null}
        isPending={updateCodeMutation.isPending}
        onClose={() => setOpen(false)}
        onSave={(data) => updateCodeMutation.mutate(data, { onSuccess: () => setOpen(false) })}
      />
    </section>
  )
}
