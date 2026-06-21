import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, FloppyDisk, GenderMale, GenderFemale, Heartbeat, TrendDown, TrendUp, Minus } from '@phosphor-icons/react'
import Spinner from '../../../shared/components/Spinner'

const optionalNumber = (min: number, max: number) =>
  z.number().optional()
    .transform(val => (val !== undefined && isNaN(val) ? undefined : val))
    .pipe(z.number().min(min).max(max).optional())

const GOALS = [
  { value: 'lose' as const, label: 'Perder peso', Icon: TrendDown },
  { value: 'gain' as const, label: 'Ganhar massa', Icon: TrendUp },
  { value: 'mantain' as const, label: 'Manter peso', Icon: Minus },
]

const bodySchema = z.object({
  height: optionalNumber(100, 250),
  birthDate: z.string().date().optional(),
  gender: z.enum(['male', 'female']).optional(),
  goal: z.enum(['lose', 'gain', 'mantain']).optional(),
})

type BodyData = z.infer<typeof bodySchema>

interface Props {
  isOpen: boolean
  isPending: boolean
  defaultValues: { height: number | null; birthDate: string | null; gender: string | null; goal: 'lose' | 'gain' | 'mantain' | null }
  onClose: () => void
  onSave: (data: BodyData) => void
}

export default function PatientBodyEditModal({ isOpen, isPending, defaultValues, onClose, onSave }: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BodyData>({
    resolver: zodResolver(bodySchema),
  })

  const gender = watch('gender')
  const goal = watch('goal')

  useEffect(() => {
    if (isOpen) {
      reset({
        height: defaultValues.height ?? undefined,
        birthDate: defaultValues.birthDate ? defaultValues.birthDate.slice(0, 10) : undefined,
        gender: (defaultValues.gender as 'male' | 'female' | undefined) ?? undefined,
        goal: defaultValues.goal ?? undefined,
      })
    }
  }, [isOpen, defaultValues])

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
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-y-auto max-h-[90vh]"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            <div className="flex items-center justify-between px-7 pt-7 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Heartbeat size={16} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Dados corporais</h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Usados para calcular seu plano</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                <X size={13} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-7 pb-7 flex flex-col gap-5">
              {/* Gender */}
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2.5">
                  Sexo biológico
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'male' as const, label: 'Masculino', Icon: GenderMale },
                    { value: 'female' as const, label: 'Feminino', Icon: GenderFemale },
                  ]).map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('gender', gender === value ? undefined : value)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                        gender === value
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-800'
                      }`}
                    >
                      <Icon size={16} weight="bold" className={gender === value ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'} />
                      <span className={`text-sm font-bold ${gender === value ? 'text-red-700 dark:text-red-300' : 'text-neutral-600 dark:text-neutral-300'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Altura
                </label>
                <div className="relative">
                  <input
                    {...register('height', { valueAsNumber: true })}
                    type="number"
                    placeholder="175"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 pr-8 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 font-medium">cm</span>
                </div>
                {errors.height && <p className="text-[10px] text-red-500 mt-1">{errors.height.message}</p>}
              </div>

              {/* Birth Date */}
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Data de nascimento
                </label>
                <input
                  {...register('birthDate', { setValueAs: (v: string) => v === '' ? undefined : v })}
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all duration-150"
                />
                {errors.birthDate && <p className="text-[10px] text-red-500 mt-1">{errors.birthDate.message}</p>}
              </div>

              {/* Goal */}
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2.5">
                  Objetivo
                </label>
                <div className="flex flex-col gap-2">
                  {GOALS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('goal', goal === value ? undefined : value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                        goal === value
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-800'
                      }`}
                    >
                      <Icon size={16} weight="bold" className={goal === value ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'} />
                      <span className={`text-sm font-bold ${goal === value ? 'text-red-700 dark:text-red-300' : 'text-neutral-600 dark:text-neutral-300'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.goal && <p className="text-[10px] text-red-500 mt-1">{errors.goal.message}</p>}
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
