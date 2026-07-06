import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Coffee, ForkKnife, Leaf, Moon, Cookie, FloppyDisk, CopySimple, X } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { toLocalISODate } from '@/shared/utils/date'
import { createMealSchema, type CreateMealData } from '../types/createMeal'
import type { MealType, MealTypeConfig } from '../types/mealTypeConfig'
import { useCreateMeal } from '../hooks/useCreateMeal'
import { useCopyMealItems } from '../hooks/useCopyMealItems'
import type { Meal } from '../types/meal'
import PlanMealPicker from './PlanMealPicker'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'

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

  const [showPicker, setShowPicker] = useState(false)
  const [selectedPlanMeal, setSelectedPlanMeal] = useState<Meal | null>(null)

  const createMeal = useCreateMeal()
  const copyMealItems = useCopyMealItems()

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

  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  const selectedType = watch('mealType')

  const handlePlanMealSelect = (meal: Meal) => {
    setSelectedPlanMeal(meal)
    setShowPicker(false)
    if (meal.mealType) {
      setValue('mealType', meal.mealType as MealType, { shouldValidate: true })
    }
  }

  const handleClearPlanMeal = () => {
    setSelectedPlanMeal(null)
    setShowPicker(false)
  }

  const isSubmitting = createMeal.isPending || copyMealItems.isPending

  const onSubmit = handleSubmit((data) => {
    createMeal.mutate(
      {
        kind,
        mealType: data.mealType,
        time: data.time,
        date: toLocalISODate(),
      },
      {
        onSuccess: async (createdMeal) => {
          if (!createdMeal?.id) {
            toast.error('Erro ao redirecionar. Tente novamente.')
            return
          }
          if (selectedPlanMeal) {
            try {
              await copyMealItems.mutateAsync({ targetId: createdMeal.id, sourceMeal: selectedPlanMeal })
            } catch {
              toast.error('Refeição criada, mas erro ao copiar itens do plano.')
            }
          }
          navigate(`/app/meals/${createdMeal.id}`)
        },
      },
    )
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      {/* Meal type */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 transition-colors duration-300">
        <p className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
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
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${!isSelected ? 'bg-neutral-100 dark:bg-neutral-800 border-transparent' : ''}`}
                style={isSelected ? { borderColor: cfg.accent, backgroundColor: isDark ? `${cfg.accent}26` : cfg.accentLight } : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${!isSelected ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
                  style={isSelected ? { backgroundColor: isDark ? `${cfg.accent}26` : cfg.accentLight } : undefined}
                >
                  <Ico size={18} weight="bold" style={{ color: isSelected ? (isDark ? cfg.accentLight : cfg.accentText) : undefined }} className={!isSelected ? 'text-neutral-400 dark:text-neutral-500' : ''} />
                </div>
                <span
                  className={`text-[10px] font-black tracking-widest leading-none text-center ${!isSelected ? 'text-neutral-400 dark:text-neutral-500' : ''}`}
                  style={isSelected ? { color: isDark ? cfg.accentLight : cfg.accentText } : undefined}
                >
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.mealType && <p className="text-xs text-red-500 mt-2">{errors.mealType.message}</p>}
      </div>

      {/* Time */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 transition-colors duration-300">
        <label className="block text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">
          Horário
        </label>
        <input
          {...register('time')}
          type="time"
          className="font-display text-3xl font-black text-neutral-950 dark:text-neutral-100 bg-transparent outline-none border-b-2 border-neutral-200 dark:border-neutral-700 focus:border-neutral-500 dark:focus:border-neutral-500 pb-1 transition-colors duration-300 tabular-nums cursor-pointer"
        />
        {errors.time && <p className="text-xs text-red-500 mt-2">{errors.time.message}</p>}
      </div>

      {/* Copy from plan meal — only DAILY */}
      {!isPlan && (
        <div className="flex flex-col gap-3">
          {selectedPlanMeal ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-colors duration-300">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-0.5">
                  Copiando do plano
                </p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                  {selectedPlanMeal.name}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {selectedPlanMeal.items.length + selectedPlanMeal.recipes.length} itens ·{' '}
                  {Math.round(selectedPlanMeal.totals.calories)} kcal
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearPlanMeal}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 cursor-pointer shrink-0"
              >
                <X size={15} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer"
            >
              <CopySimple size={16} weight="bold" />
              Copiar refeição planejada
            </button>
          )}

          {showPicker && !selectedPlanMeal && (
            <PlanMealPicker onSelect={handlePlanMealSelect} onClose={() => setShowPicker(false)} />
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white transition-colors duration-200 cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <FloppyDisk size={17} weight="bold" />
        )}
        {isSubmitting ? 'Salvando…' : 'Salvar refeição'}
      </button>
    </form>
  )
}
