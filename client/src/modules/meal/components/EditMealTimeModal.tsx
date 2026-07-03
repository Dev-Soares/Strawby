import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, PencilSimple, FloppyDisk } from '@phosphor-icons/react'
import { updateMealSchema, MEAL_TYPES, type UpdateMealData } from '../types/updateMeal'
import { mealConfig } from '../config/mealConfig'
import Spinner from '@/shared/components/Spinner'

interface Props {
  isOpen: boolean
  currentMealType: string | null
  currentTime: string | null
  isPending: boolean
  onClose: () => void
  onSave: (data: UpdateMealData) => void
}

const FALLBACK_TYPE = 'breakfast'

export default function EditMealTimeModal({ isOpen, currentMealType, currentTime, isPending, onClose, onSave }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<UpdateMealData>({
    resolver: zodResolver(updateMealSchema),
    defaultValues: {
      mealType: (MEAL_TYPES as readonly string[]).includes(currentMealType ?? '')
        ? (currentMealType as UpdateMealData['mealType'])
        : FALLBACK_TYPE,
      time: currentTime ?? '',
    },
  })

  const selectedType = watch('mealType')

  useEffect(() => {
    if (isOpen) {
      reset({
        mealType: (MEAL_TYPES as readonly string[]).includes(currentMealType ?? '')
          ? (currentMealType as UpdateMealData['mealType'])
          : FALLBACK_TYPE,
        time: currentTime ?? '',
      })
    }
  }, [isOpen, currentMealType, currentTime])

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
                  <PencilSimple size={16} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Editar refeição</h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Ajuste o tipo e o horário</p>
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
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Tipo
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {MEAL_TYPES.map((type) => {
                    const cfg = mealConfig[type]
                    const Icon = cfg.icon
                    const active = selectedType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setValue('mealType', type, { shouldValidate: true })}
                        title={cfg.label}
                        className={`flex items-center justify-center h-11 rounded-xl border transition-all duration-150 cursor-pointer ${
                          active
                            ? 'border-transparent'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                        }`}
                        style={active ? { backgroundColor: cfg.theme } : undefined}
                      >
                        <Icon
                          size={18}
                          weight="bold"
                          className={active ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}
                        />
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs font-semibold mt-2" style={{ color: mealConfig[selectedType]?.theme }}>
                  {mealConfig[selectedType]?.label}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Horário
                </label>
                <input
                  {...register('time')}
                  type="time"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-neutral-900 transition-all duration-150"
                />
                {errors.time && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.time.message}</p>
                )}
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
                {isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
