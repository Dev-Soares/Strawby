import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Key, FloppyDisk } from '@phosphor-icons/react'
import { updateCodeSchema, type UpdateCodeData } from '../types/updateCode'
import Spinner from '@/shared/components/Spinner'

interface Props {
  isOpen: boolean
  currentCode: string | null
  isPending: boolean
  onClose: () => void
  onSave: (data: UpdateCodeData) => void
}

export default function UpdateCodeModal({ isOpen, currentCode, isPending, onClose, onSave }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateCodeData>({
    resolver: zodResolver(updateCodeSchema),
    defaultValues: { code: currentCode ?? '' },
  })

  useEffect(() => {
    if (isOpen) reset({ code: currentCode ?? '' })
  }, [isOpen, currentCode])

  const onSubmit = handleSubmit((data) => onSave(data))

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
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            <div className="flex items-center justify-between px-7 pt-7 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Key size={16} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Código de convite</h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Compartilhe com seus pacientes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <X size={13} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-7 pb-7 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Novo código
                </label>
                <input
                  {...register('code')}
                  type="text"
                  placeholder="ex: dr-joao-2024"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-neutral-900 transition-all duration-150 placeholder:font-normal placeholder:text-neutral-400"
                />
                {errors.code && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.code.message}</p>
                )}
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2">
                  Use letras, números, hífen ou underscore. Mínimo 4 caracteres.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-950 text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? <Spinner size={15} />
                  : <FloppyDisk size={15} weight="bold" />
                }
                {isPending ? 'Salvando…' : 'Salvar código'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
