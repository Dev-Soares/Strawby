import { AnimatePresence, motion } from 'framer-motion'
import { X, ClockCounterClockwise, User } from '@phosphor-icons/react'
import { useGetConnectionRequestHistory } from '../hooks/useGetConnectionRequestHistory'
import ConnectionHistorySkeleton from '../skeletons/ConnectionHistorySkeleton'
import type { ConnectionRequest } from '../types/connectionRequest'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const statusConfig: Record<
  ConnectionRequest['status'],
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  },
  ACCEPTED: {
    label: 'Aceito',
    className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  REJECTED: {
    label: 'Recusado',
    className: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
  },
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export default function ConnectionHistoryModal({ isOpen, onClose }: Props) {
  const { data: history, isPending, isError } = useGetConnectionRequestHistory(isOpen)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-80 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            <div className="flex items-center justify-between px-7 pt-7 pb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <ClockCounterClockwise size={16} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Histórico de conexões</h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Solicitações recebidas de pacientes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shrink-0"
              >
                <X size={13} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>

            <div className="px-7 pb-7 overflow-y-auto">
              {isPending ? (
                <ConnectionHistorySkeleton />
              ) : isError ? (
                <p className="text-sm font-semibold text-red-500 text-center py-8">
                  Erro ao carregar histórico.
                </p>
              ) : !history || history.length === 0 ? (
                <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-8">
                  Nenhuma solicitação de conexão ainda.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {history.map((request) => {
                    const status = statusConfig[request.status]
                    return (
                      <div
                        key={request.id}
                        className="flex items-center gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 p-4 transition-colors duration-300"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                          <User size={16} weight="bold" className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                            {request.patient.user.name}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
