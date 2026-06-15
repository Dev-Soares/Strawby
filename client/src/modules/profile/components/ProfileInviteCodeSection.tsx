import { useState } from 'react'
import { Copy, PencilSimple, Stethoscope, Check, CalendarBlank, Users } from '@phosphor-icons/react'
import { useGetNutritionist } from '@/modules/nutritionist/hooks/useGetNutritionist'
import { useGetPatients } from '@/modules/nutritionist/hooks/useGetPatients'
import { useUpdateCode } from '@/modules/nutritionist/hooks/useUpdateCode'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import UpdateCodeModal from '@/modules/nutritionist/components/UpdateCodeModal'
import toast from 'react-hot-toast'

export default function ProfileInviteCodeSection() {
  const { data: nutritionist } = useGetNutritionist()
  const { data: user } = useAuth()
  const { data: patients } = useGetPatients()
  const updateCodeMutation = useUpdateCode()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!nutritionist?.code) return
    navigator.clipboard.writeText(nutritionist.code)
    toast.success('Código copiado!')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const memberSinceDate = nutritionist?.createdAt ? new Date(nutritionist.createdAt) : null
  const memberSinceYear = memberSinceDate?.getFullYear() ?? null
  const memberSinceMonth = memberSinceDate
    ? new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(memberSinceDate)
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-start">

      <div className="lg:pr-16 lg:border-r border-neutral-100 dark:border-neutral-800">
        <div className="mb-5 px-1">
          <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            Sua identidade
          </h2>
          <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
            Informações do profissional
          </p>
        </div>

        <div className="flex items-center gap-4 px-1 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-md shadow-red-950/40">
            <Stethoscope size={28} weight="bold" className="text-white" />
          </div>
          <p className="font-display text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight transition-colors duration-300">
            {user?.name ?? '—'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-violet-50/60 dark:hover:bg-violet-950/15 transition-all duration-150">
            <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center shrink-0 shadow-md shadow-violet-200 dark:shadow-violet-950/40">
              <CalendarBlank size={22} weight="bold" className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-violet-400 dark:text-violet-500 uppercase tracking-widest mb-0.5">Desde</p>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-display text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                  {memberSinceYear ?? '—'}
                </span>
                {memberSinceMonth && (
                  <span className="text-sm font-bold text-violet-400 dark:text-violet-500">{memberSinceMonth}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/15 transition-all duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200 dark:shadow-emerald-950/40">
              <Users size={22} weight="bold" className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-400 dark:text-emerald-500 uppercase tracking-widest mb-0.5">Pacientes</p>
              <span className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">
                {patients?.length ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:pl-16">
        <div className="flex items-start justify-between mb-5 px-1">
          <div>
            <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
              Código de convite
            </h2>
            <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
              Compartilhe com seus pacientes para se conectar
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.97] transition-all duration-150 cursor-pointer shrink-0"
          >
            <PencilSimple size={14} weight="bold" />
            Alterar
          </button>
        </div>

        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5">
          <p className="font-mono text-4xl font-extrabold text-white tracking-[0.18em] leading-none mb-5">
            {nutritionist?.code ?? '——'}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!nutritionist?.code}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied
              ? <Check size={16} weight="bold" className="text-white" />
              : <Copy size={16} weight="bold" className="text-white" />
            }
            <span className="text-sm font-bold text-white">
              {copied ? 'Copiado!' : 'Copiar código'}
            </span>
          </button>
        </div>
      </div>

      <UpdateCodeModal
        isOpen={open}
        currentCode={nutritionist?.code ?? null}
        isPending={updateCodeMutation.isPending}
        onClose={() => setOpen(false)}
        onSave={(data) => updateCodeMutation.mutate(data, { onSuccess: () => setOpen(false) })}
      />
    </div>
  )
}
