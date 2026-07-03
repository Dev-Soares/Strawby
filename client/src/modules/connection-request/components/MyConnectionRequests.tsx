import { Stethoscope, Clock, Check, X, Trash } from '@phosphor-icons/react'
import { useGetMyConnectionRequests } from '../hooks/useGetMyConnectionRequests'
import { useCancelConnectionRequest } from '../hooks/useCancelConnectionRequest'
import MyConnectionRequestsSkeleton from '../skeletons/MyConnectionRequestsSkeleton'
import Spinner from '@/shared/components/Spinner'
import type { MyConnectionRequest } from '../types/myConnectionRequest'

const statusConfig: Record<
  MyConnectionRequest['status'],
  { label: string; Icon: typeof Clock; className: string; iconClassName: string }
> = {
  PENDING: {
    label: 'Aguardando resposta',
    Icon: Clock,
    className: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    iconClassName: 'text-amber-500',
  },
  ACCEPTED: {
    label: 'Aceito',
    Icon: Check,
    className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    iconClassName: 'text-emerald-500',
  },
  REJECTED: {
    label: 'Recusado',
    Icon: X,
    className: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
    iconClassName: 'text-neutral-400',
  },
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

export default function MyConnectionRequests() {
  const { data: requests, isPending, isError } = useGetMyConnectionRequests()
  const cancelMutation = useCancelConnectionRequest()
  const cancelingId = cancelMutation.isPending ? cancelMutation.variables : null

  if (isPending) return <MyConnectionRequestsSkeleton />
  if (isError || !requests || requests.length === 0) return null

  return (
    <div className="mt-6">
      <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3 px-1">
        Suas solicitações
      </p>
      <div className="flex flex-col gap-2">
        {requests.map((request) => {
          const status = statusConfig[request.status]
          return (
            <div
              key={request.id}
              className="flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                <Stethoscope size={16} weight="bold" className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {request.nutritionist.user.name}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
                  {formatDate(request.createdAt)}
                </p>
              </div>
              <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${status.className}`}>
                <status.Icon size={12} weight="bold" className={status.iconClassName} />
                {status.label}
              </span>
              {request.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => cancelMutation.mutate(request.id)}
                  disabled={cancelMutation.isPending}
                  title="Cancelar solicitação"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-500 transition-colors duration-150 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelingId === request.id
                    ? <Spinner size={13} />
                    : <Trash size={14} weight="bold" />
                  }
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
