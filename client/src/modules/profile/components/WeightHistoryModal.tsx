import { AnimatePresence, motion } from 'framer-motion'
import { X, ClockCounterClockwise, Scales, Trash } from '@phosphor-icons/react'
import { useDeletePatientWeight } from '@/modules/patient/hooks/useDeletePatientWeight'
import Spinner from '@/shared/components/Spinner'
import type { WeightRecord } from '@/modules/patient/service/getPatientWeightRecordsService'

interface Props {
  isOpen: boolean
  patientId: string
  records: WeightRecord[]
  onClose: () => void
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}/${month}/${year}`
}

export default function WeightHistoryModal({ isOpen, patientId, records, onClose }: Props) {
  const deleteMutation = useDeletePatientWeight(patientId)
  const deletingId = deleteMutation.isPending ? deleteMutation.variables : null

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
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Histórico de peso</h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Todos os registros salvos</p>
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
              {records.length === 0 ? (
                <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-8">
                  Nenhum registro de peso ainda.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 p-4 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                        <Scales size={16} weight="bold" className="text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-lg font-extrabold text-neutral-900 dark:text-neutral-100 leading-none">
                            {record.weight}
                          </span>
                          <span className="text-xs font-bold text-neutral-400">kg</span>
                        </div>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                          {formatDate(record.date)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(record.id)}
                        disabled={deleteMutation.isPending}
                        title="Remover registro"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-500 transition-colors duration-150 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === record.id
                          ? <Spinner size={14} />
                          : <Trash size={15} weight="bold" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
