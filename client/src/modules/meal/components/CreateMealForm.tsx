import { FloppyDisk, CopySimple, X } from '@phosphor-icons/react'
import { MEAL_TYPE_LIST } from '@/shared/config/mealTypes'
import { useCreateMealForm } from '../hooks/useCreateMealForm'
import PlanMealPicker from './PlanMealPicker'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'

export default function CreateMealForm() {
  const {
    register,
    setValue,
    errors,
    selectedType,
    onSubmit,
    isPlan,
    showPicker,
    selectedPlanMeal,
    selectPlanMeal,
    clearPlanMeal,
    togglePicker,
    closePicker,
    isSubmitting,
  } = useCreateMealForm()

  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      {/* Meal type */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 transition-colors duration-300">
        <p className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
          Tipo de refeição
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {MEAL_TYPE_LIST.map((cfg) => {
            const key = cfg.value
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

      {/* Observations */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 transition-colors duration-300">
        <label className="block text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">
          Observações
        </label>
        <textarea
          {...register('observations')}
          rows={3}
          placeholder="Ex: sem glúten, sem lactose..."
          className="w-full bg-transparent outline-none border-2 border-neutral-200 dark:border-neutral-700 focus:border-neutral-500 dark:focus:border-neutral-500 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none transition-colors duration-300"
        />
        {errors.observations && <p className="text-xs text-red-500 mt-2">{errors.observations.message}</p>}
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
                onClick={clearPlanMeal}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 cursor-pointer shrink-0"
              >
                <X size={15} weight="bold" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={togglePicker}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer"
            >
              <CopySimple size={16} weight="bold" />
              Copiar refeição planejada
            </button>
          )}

          {showPicker && !selectedPlanMeal && (
            <PlanMealPicker onSelect={selectPlanMeal} onClose={closePicker} />
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
