import { motion } from 'framer-motion'
import { User, Check, X } from '@phosphor-icons/react'
import type { ConnectionRequest } from '../types/connectionRequest'

interface Props {
  request: ConnectionRequest
  index: number
  onAccept: (id: string) => void
  onReject: (id: string) => void
  isPending: boolean
}

export default function ConnectionRequestCard({ request, index, onAccept, onReject, isPending }: Props) {
  const initials = request.patient.user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const date = new Date(request.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col gap-4 transition-colors duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0 transition-colors duration-300">
          {initials ? (
            <span className="text-sm font-extrabold text-red-600 dark:text-red-400">{initials}</span>
          ) : (
            <User size={16} weight="bold" className="text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate transition-colors duration-300">
            {request.patient.user.name}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5 transition-colors duration-300">
            {request.patient.user.email}
          </p>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5">
          {date}
        </span>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 flex gap-2 transition-colors duration-300">
        <button
          onClick={() => onReject(request.id)}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={13} weight="bold" />
          Recusar
        </button>
        <button
          onClick={() => onAccept(request.id)}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={13} weight="bold" />
          Aceitar
        </button>
      </div>
    </motion.div>
  )
}
