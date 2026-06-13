import { DownloadSimple } from '@phosphor-icons/react'
import { useDownloadPlanPdf } from '../hooks/useDownloadPlanPdf'

type Props = {
  patientId: string
  compact?: boolean
}

export default function DownloadPlanPdfButton({ patientId, compact = false }: Props) {
  const { mutate: download, isPending } = useDownloadPlanPdf(patientId)

  if (compact) {
    return (
      <button
        onClick={() => download()}
        disabled={isPending}
        className="flex items-center gap-2 text-sm font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition-all cursor-pointer"
      >
        {isPending
          ? <span className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-700 dark:border-neutral-600 dark:border-t-neutral-200 rounded-full animate-spin shrink-0" />
          : <DownloadSimple size={18} weight="bold" />
        }
        PDF
      </button>
    )
  }

  return (
    <button
      onClick={() => download()}
      disabled={isPending}
      className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-3 rounded-2xl transition-colors duration-200 cursor-pointer"
    >
      <FilePdf size={16} weight="bold" />
      {isPending ? 'Gerando...' : 'Exportar PDF'}
    </button>
  )
}
