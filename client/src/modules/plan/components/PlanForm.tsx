import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema, type PlanData } from '../types/plan'
import { Fire, FloppyDisk } from '@phosphor-icons/react'
import toast from 'react-hot-toast'

interface MacroCard {
  label: string
  field: keyof Pick<PlanData, 'protein' | 'carbs' | 'fat'>
  color: string
  trackColor: string
  max: number
}

const macros: MacroCard[] = [
  { label: 'Proteína', field: 'protein', color: '#f59e0b', trackColor: '#fef3c7', max: 500 },
  { label: 'Carboidratos', field: 'carbs', color: '#3b82f6', trackColor: '#dbeafe', max: 800 },
  { label: 'Gordura', field: 'fat', color: '#a855f7', trackColor: '#f3e8ff', max: 300 },
]

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
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-7">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Fire size={16} weight="fill" className="text-red-500" />
              <h2 className="text-sm font-bold text-neutral-900">Meta calórica diária</h2>
            </div>
            <p className="text-xs text-neutral-400">Energia total consumida por dia</p>
          </div>

          <div className="text-right">
            <div className="flex items-end gap-2 justify-end">
              <input
                {...register('calories', { valueAsNumber: true })}
                type="number"
                className="w-36 text-5xl font-extrabold text-neutral-950 bg-transparent outline-none text-right border-b-2 border-neutral-200 focus:border-red-500 pb-1 transition-colors duration-200"
              />
              <span className="text-lg font-semibold text-neutral-400 pb-1.5">kcal</span>
            </div>
            {errors.calories && (
              <p className="text-xs text-red-500 mt-1">{errors.calories.message}</p>
            )}
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-red-50 overflow-hidden">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.min((Number(calories) || 0) / 5000 * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-neutral-400">1.000 kcal</span>
          <span className="text-[10px] text-neutral-400">5.000 kcal</span>
        </div>
      </div>

      {/* Macro cards — 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        {macros.map((macro) => {
          const value = watchValues[macro.field] || 0
          const progress = Math.min(value / macro.max, 1)
          return (
            <div key={macro.field} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wide">{macro.label}</span>
              </div>

              <div className="flex items-end gap-1.5 mb-4">
                <input
                  {...register(macro.field, { valueAsNumber: true })}
                  type="number"
                  className="w-full text-4xl font-extrabold text-neutral-950 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-neutral-400 pb-0.5 transition-colors duration-200"
                  style={{ borderBottomColor: `${macro.color}40` }}
                  onFocus={(e) => e.currentTarget.style.borderBottomColor = macro.color}
                  onBlur={(e) => e.currentTarget.style.borderBottomColor = `${macro.color}40`}
                />
                <span className="text-base font-semibold text-neutral-400 pb-1.5">g</span>
              </div>

              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: macro.trackColor }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, backgroundColor: macro.color }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1.5">máx. {macro.max}g</p>

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
