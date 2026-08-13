import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema, type PlanData } from '../types/plan'
import { Fire, FloppyDisk } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { MACROS } from '@/shared/config/macros'

const macros = MACROS.map(({ field, label, color, track, max, inputBorder }) => ({
  field,
  label,
  color,
  trackColor: track,
  max,
  inputBorder,
}))

interface PlanFormProps {
  defaultValues: PlanData
}

export default function PlanForm({ defaultValues }: PlanFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues,
  })

  const calories = watch('calories')
  const watchValues = { protein: watch('protein'), carbs: watch('carbs'), fat: watch('fat') }

  const onSubmit = handleSubmit(() => toast.success('Plano salvo com sucesso!'))

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Calorie target — full width */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-7 transition-colors duration-300">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Fire size={16} weight="fill" className="text-red-500" />
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-200 transition-colors duration-300">Meta calórica diária</h2>
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">Energia total consumida por dia</p>
          </div>

          <div className="text-right">
            <div className="flex items-end gap-2 justify-end">
              <input
                {...register('calories', { valueAsNumber: true })}
                type="number"
                className="w-36 text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 bg-transparent outline-none text-right border-b-2 border-neutral-200 dark:border-neutral-700 focus:border-red-500 pb-1 transition-colors duration-200"
              />
              <span className="text-lg font-semibold text-neutral-400 dark:text-neutral-500 pb-1.5 transition-colors duration-300">kcal</span>
            </div>
            {errors.calories && (
              <p className="text-xs text-red-500 mt-1">{errors.calories.message}</p>
            )}
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-red-50 dark:bg-red-950/40 overflow-hidden transition-colors duration-300">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.min((Number(calories) || 0) / 5000 * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 transition-colors duration-300">1.000 kcal</span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 transition-colors duration-300">5.000 kcal</span>
        </div>
      </div>

      {/* Macro cards — 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        {macros.map((macro) => {
          const value = watchValues[macro.field] || 0
          const progress = Math.min(value / macro.max, 1)
          return (
            <div key={macro.field} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-5 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide transition-colors duration-300">{macro.label}</span>
              </div>

              <div className="flex items-end gap-1.5 mb-4">
                <input
                  {...register(macro.field, { valueAsNumber: true })}
                  type="number"
                  className={`w-full text-4xl font-extrabold text-neutral-950 dark:text-neutral-100 bg-transparent outline-none border-b-2 pb-0.5 transition-colors duration-200 ${macro.inputBorder}`}
                />
                <span className="text-base font-semibold text-neutral-400 dark:text-neutral-500 pb-1.5 transition-colors duration-300">g</span>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: macro.trackColor }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, backgroundColor: macro.color }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 transition-colors duration-300">máx. {macro.max}g</p>

              {errors[macro.field] && (
                <p className="text-xs text-red-500 mt-1">{errors[macro.field]?.message}</p>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-colors duration-200 cursor-pointer"
      >
        <FloppyDisk size={18} weight="bold" />
        Salvar Plano
      </button>
    </form>
  )
}
