import { useState } from 'react'
import { Copy, PencilSimple } from '@phosphor-icons/react'
import { useGetNutritionist } from '@/modules/nutritionist/hooks/useGetNutritionist'
import { useUpdateCode } from '@/modules/nutritionist/hooks/useUpdateCode'
import UpdateCodeModal from '@/modules/nutritionist/components/UpdateCodeModal'
import toast from 'react-hot-toast'

export default function ProfileInviteCodeSection() {
  const { data: nutritionist } = useGetNutritionist()
  const updateCodeMutation = useUpdateCode()
  const [open, setOpen] = useState(false)

  const handleCopy = () => {
    if (nutritionist?.code) {
      navigator.clipboard.writeText(nutritionist.code)
      toast.success('Código copiado!')
    }
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
          Código de convite
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <PencilSimple size={11} weight="bold" />
          Alterar
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!nutritionist?.code}
        className="w-full flex items-center justify-between active:opacity-60 active:scale-[0.98] transition-all duration-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 group"
      >
        <div className="text-left">
          <p className="font-mono text-4xl font-extrabold text-neutral-900 dark:text-white tracking-[0.12em] leading-none mb-1.5">
            {nutritionist?.code ?? '—'}
          </p>
          <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.15em]">
            Toque para copiar · Compartilhe com pacientes
          </p>
        </div>
        <Copy
          size={18}
          weight="bold"
          className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors shrink-0 ml-4"
        />
      </button>

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
