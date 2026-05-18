import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Coffee, ForkKnife, Leaf, Moon, Cookie, FloppyDisk } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { createMealSchema, type CreateMealData } from '../types/createMeal'
import type { MealType, MealTypeConfig } from '../types/mealTypeConfig'
import { useCreateMeal } from '../hooks/useCreateMeal'

const mealTypes: Record<MealType, MealTypeConfig> = {
  breakfast: { icon: Coffee, label: 'MANHÃ', name: 'Café da manhã', accent: '#ea580c', accentLight: '#fed7aa', accentText: '#c2410c' },
  lunch: { icon: ForkKnife, label: 'ALMOÇO', name: 'Almoço', accent: '#16a34a', accentLight: '#bbf7d0', accentText: '#15803d' },
  snack: { icon: Leaf, label: 'LANCHE', name: 'Lanche', accent: '#2563eb', accentLight: '#bfdbfe', accentText: '#1d4ed8' },
  dinner: { icon: Moon, label: 'JANTAR', name: 'Jantar', accent: '#9333ea', accentLight: '#e9d5ff', accentText: '#7e22ce' },
  supper: { icon: Cookie, label: 'CEIA', name: 'Ceia', accent: '#475569', accentLight: '#cbd5e1', accentText: '#334155' },
}

export default function CreateMealForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') ?? 'meal'
  const isPlan = type === 'plan-meal'
  const kind = isPlan ? 'PLAN' : 'DAILY'

  const createMeal = useCreateMeal()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateMealData>({
    resolver: zodResolver(createMealSchema),
    defaultValues: { time: '07:00', kind },
  })

  const selectedType = watch('mealType')

  const onSubmit = handleSubmit((data) => {
    createMeal.mutate(
      {
        kind,
        mealType: data.mealType,
        time: isPlan ? undefined : data.time,
        date: new Date().toISOString(),
      },
      {
        onSuccess: (createdMeal) => {
          if (!createdMeal?.id) {
            console.error('[CreateMealForm] createdMeal missing id', createdMeal)
            toast.error('Erro ao redirecionar. Tente novamente.')
            return
          }
          navigate(`/meals/${createdMeal.id}`)
        },
      },
    )
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      {/* Meal type */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-4">
          Tipo de refeição
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(Object.entries(mealTypes) as [MealType, MealTypeConfig][]).map(([key, cfg]) => {
            const Ico = cfg.icon
            const isSelected = selectedType === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue('mealType', key, { shouldValidate: true })}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer"
                style={{
                  borderColor: isSelected ? cfg.accent : 'transparent',
                  backgroundColor: isSelected ? cfg.accentLight : '#f9fafb',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isSelected ? cfg.accentLight : '#f3f4f6' }}
                >
                  <Ico size={18} weight="bold" style={{ color: isSelected ? cfg.accentText : '#9ca3af' }} />
                </div>
                <span
                  className="text-[10px] font-black tracking-widest leading-none text-center"
                  style={{ color: isSelected ? cfg.accentText : '#9ca3af' }}
                >
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.mealType && <p className="text-xs text-red-500 mt-2">{errors.mealType.message}</p>}
      </div>

      {/* Time — only DAILY */}
      {!isPlan && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
          <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
            Horário
          </label>
          <input
            {...register('time')}
            type="time"
            className="font-display text-3xl font-black text-neutral-950 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-neutral-500 pb-1 transition-colors duration-150 tabular-nums cursor-pointer"
          />
          {errors.time && <p className="text-xs text-red-500 mt-2">{errors.time.message}</p>}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={createMeal.isPending}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white transition-colors duration-200 cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createMeal.isPending ? (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <FloppyDisk size={17} weight="bold" />
        )}
        {createMeal.isPending ? 'Salvando…' : 'Salvar refeição'}
      </button>
    </form>
  )
}
