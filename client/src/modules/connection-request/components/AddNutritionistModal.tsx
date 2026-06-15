import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Key, PaperPlaneTilt, ChatCircleText } from '@phosphor-icons/react'

const schema = z.object({
  code: z.string().min(1, 'Código obrigatório'),
})
type FormData = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  isPending: boolean
  onClose: () => void
  onSend: (code: string) => void
}

export default function AddNutritionistModal({ isOpen, isPending, onClose, onSend }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isOpen) reset()
  }, [isOpen])

  const onSubmit = handleSubmit(({ code }) => onSend(code))

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
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center">
                  <Key size={16} weight="bold" className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">
                    Adicionar nutricionista
                  </h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Insira o código do seu nutricionista
                  </p>
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

            <form onSubmit={onSubmit} className="px-7 pb-7 flex flex-col gap-5">

              <div className="rounded-2xl bg-red-600/10 border border-red-600/20 px-4 py-4 flex items-start gap-3">
                <ChatCircleText size={20} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-500 mb-1">Não sabe o código?</p>
                  <p className="text-xs font-medium text-neutral-300 leading-relaxed">
                    Peça ao seu nutricionista — ele encontra o código de convite no perfil dele dentro do app.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Código de convite
                </label>
                <input
                  {...register('code')}
                  type="text"
                  placeholder="ex: dr-joao-2024"
                  autoFocus
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-red-400 dark:focus:border-red-600 focus:bg-white dark:focus:bg-neutral-900 transition-all duration-150 placeholder:font-normal placeholder:text-neutral-400"
                />
                {errors.code && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.code.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending
                  ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <PaperPlaneTilt size={15} weight="bold" />
                }
                {isPending ? 'Enviando…' : 'Enviar solicitação'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
