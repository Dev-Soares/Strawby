import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Check, Copy, History, KeyRound, Pencil, Stethoscope, Users } from 'lucide-react'
import { useGetNutritionist } from '@/modules/nutritionist/hooks/useGetNutritionist'
import { useGetPatients } from '@/modules/nutritionist/hooks/useGetPatients'
import { useUpdateCode } from '@/modules/nutritionist/hooks/useUpdateCode'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import UpdateCodeModal from '@/modules/nutritionist/components/UpdateCodeModal'
import ConnectionHistoryModal from '@/modules/connection-request/components/ConnectionHistoryModal'
import toast from 'react-hot-toast'
import { PROFILE_ACCENTS } from '../config/profileAccents'

const brand = PROFILE_ACCENTS.brand
const since = PROFILE_ACCENTS.since
const patientsAccent = PROFILE_ACCENTS.body

export default function ProfileInviteCodeSection() {
  const { data: nutritionist } = useGetNutritionist()
  const { data: user } = useAuth()
  const { data: patients } = useGetPatients()
  const updateCodeMutation = useUpdateCode()
  const [open, setOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
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
    <>
      {/* Identidade */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: brand.track }}
          >
            <Stethoscope size={18} style={{ color: brand.color }} />
          </span>
          <span className="text-base font-bold tracking-tight" style={{ color: brand.color }}>
            Sua identidade
          </span>
        </div>

        <p className="font-display text-2xl sm:text-3xl font-extrabold leading-none tracking-tight text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
          {user?.name ?? '—'}
        </p>
        <p className="mt-3 mb-6 text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
          Informações do seu perfil profissional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: since.track }}
              >
                <Calendar size={15} style={{ color: since.color }} />
              </span>
              <span className="min-w-0 truncate text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
                Desde
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="font-display text-2xl font-extrabold leading-none tabular-nums"
                style={{ color: since.color }}
              >
                {memberSinceYear ?? '—'}
              </span>
              {memberSinceMonth && (
                <span className="text-sm font-semibold" style={{ color: since.color }}>
                  {memberSinceMonth}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: patientsAccent.track }}
              >
                <Users size={15} style={{ color: patientsAccent.color }} />
              </span>
              <span className="min-w-0 truncate text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
                Pacientes
              </span>
            </div>
            <span
              className="font-display text-2xl font-extrabold leading-none tabular-nums"
              style={{ color: patientsAccent.color }}
            >
              {patients?.length ?? '—'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 py-3 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <History size={16} />
          Ver histórico de conexões
        </button>
      </motion.section>

      {/* Código de convite */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-2.5 mb-6">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: brand.track }}
          >
            <KeyRound size={18} style={{ color: brand.color }} />
          </span>
          <span className="text-base font-bold tracking-tight" style={{ color: brand.color }}>
            Código de convite
          </span>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Pencil size={14} />
            Alterar
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-5 text-center transition-colors duration-300">
          <p className="font-mono text-4xl font-extrabold leading-none tracking-[0.18em] text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
            {nutritionist?.code ?? '——'}
          </p>
        </div>

        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
          Compartilhe com seus pacientes — é com ele que eles se conectam a você no app.
        </p>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!nutritionist?.code}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl bg-red-600 hover:bg-red-700 py-3 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? (
            <Check size={16} className="text-white" />
          ) : (
            <Copy size={16} className="text-white" />
          )}
          <span className="text-sm font-bold text-white">
            {copied ? 'Copiado!' : 'Copiar código'}
          </span>
        </button>
      </motion.section>

      <UpdateCodeModal
        isOpen={open}
        currentCode={nutritionist?.code ?? null}
        isPending={updateCodeMutation.isPending}
        onClose={() => setOpen(false)}
        onSave={(data) => updateCodeMutation.mutate(data, { onSuccess: () => setOpen(false) })}
      />

      <ConnectionHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  )
}
