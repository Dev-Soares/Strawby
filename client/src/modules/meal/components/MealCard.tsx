import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CaretDown, PencilSimple, Note, Clock, Plus } from '@phosphor-icons/react'
import type { Meal } from '../types/meal'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import { getMealType } from '@/shared/config/mealTypes'
import EditMealTimeModal from './EditMealTimeModal'
import { useEditMealModal } from '../hooks/useEditMealModal'

export interface MealCardProps {
  meal: Meal
  isOpen: boolean
  onToggle: () => void
}

export default function MealCard({ meal, isOpen, onToggle }: MealCardProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const config = getMealType(meal.mealType)
  const MealIcon = config.icon
  const totalKcal = Math.round(meal.totals.calories)
  const editModal = useEditMealModal({ mealId: meal.id })

  // Refeição de plano é template: só mostra hora definida.
  // Diário deriva do timestamp de registro quando não há hora explícita.
  const displayTime =
    meal.kind === 'PLAN'
      ? meal.time
      : (meal.time ??
        new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md transition-colors duration-300">
      {/* Card body */}
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center gap-3 min-w-0 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: isDark ? `${config.accent}26` : config.accentLight }}
          >
            <MealIcon size={20} weight="bold" style={{ color: isDark ? config.accentLight : config.accentText }} />
          </div>
          <span
            className="text-lg font-extrabold truncate"
            style={{ color: isDark ? config.accentLight : config.accentText }}
          >
            {meal.name}
          </span>

          {/* Hora — destaque */}
          {displayTime && (
            <div
              className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: isDark ? `${config.accent}26` : config.accentLight }}
            >
              <Clock size={16} weight="fill" style={{ color: config.accent }} />
              <span
                className="font-display text-base font-extrabold leading-none tabular-nums"
                style={{ color: isDark ? config.accentLight : config.accentText }}
              >
                {displayTime}
              </span>
            </div>
          )}
        </div>

        {/* Kcal */}
        <div className="mb-1">
          <span
            className="font-display text-4xl font-extrabold leading-none tabular-nums"
            style={{ color: config.accent }}
          >
            {totalKcal}
          </span>
          <span className="text-base font-bold text-neutral-400 dark:text-neutral-500 ml-1.5">kcal</span>
        </div>

        {/* Macro chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {[
            { l: 'Proteína', v: Math.round(meal.totals.protein) },
            { l: 'Carbos', v: Math.round(meal.totals.carbs) },
            { l: 'Gordura', v: Math.round(meal.totals.fat) },
          ].map(({ l, v }) => (
            <span
              key={l}
              className="text-sm font-bold px-3.5 py-1.5 rounded-full tabular-nums"
              style={{ backgroundColor: isDark ? `${config.accent}26` : config.accentLight, color: isDark ? config.accentLight : config.accentText }}
            >
              {v}g {l}
            </span>
          ))}
        </div>

        {/* Observations */}
        {meal.observations && (
          <div
            className="mt-3 rounded-xl p-3 flex items-start gap-2.5"
            style={{ backgroundColor: isDark ? `${config.accent}20` : config.accentLight }}
          >
            <Note
              size={16}
              weight="bold"
              className="shrink-0 mt-0.5"
              style={{ color: isDark ? config.accentLight : config.accentText }}
            />
            <p
              className="text-sm font-semibold leading-relaxed"
              style={{ color: isDark ? config.accentLight : config.accentText }}
            >
              {meal.observations}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-300 cursor-pointer"
          style={{ color: isDark ? config.accentLight : config.accentText }}
        >
          <span className="text-sm font-bold">
            Ver detalhes
          </span>
          <CaretDown
            size={16}
            weight="bold"
            className={`transition-transform duration-250 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      </div>

      {/* Detail — animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-4 flex flex-col gap-4">
              {meal.items && meal.items.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                    Alimentos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {meal.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 flex flex-col gap-1"
                      >
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-200 truncate">
                          {(item.food ?? item.privateFood)?.name ?? 'Alimento'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                            {Math.round(item.quantity)}g
                          </p>
                          <span className="text-sm font-extrabold tabular-nums text-neutral-700 dark:text-neutral-300">
                            {Math.round(item.calories)} kcal
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {meal.recipes && meal.recipes.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                    Receitas
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {meal.recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 rounded-xl p-3 flex flex-col gap-1"
                      >
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-200 truncate">
                          {recipe.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                            Receita
                          </p>
                          <span className="text-sm font-extrabold tabular-nums text-neutral-700 dark:text-neutral-300">
                            {Math.round(recipe.calories)} kcal
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!meal.items || meal.items.length === 0) && (!meal.recipes || meal.recipes.length === 0) && (
                <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 py-2">Nenhum alimento adicionado</p>
              )}

              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={editModal.open}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
                >
                  <PencilSimple size={16} weight="bold" />
                  Editar refeição
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/app/meals/${meal.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: config.accent }}
                >
                  <Plus size={16} weight="bold" />
                  Adicionar alimento
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditMealTimeModal
        isOpen={editModal.isOpen}
        currentMealType={meal.mealType}
        currentTime={meal.time ?? displayTime}
        currentObservations={meal.observations}
        isPending={editModal.isPending}
        onClose={editModal.close}
        onSave={editModal.handleSave}
      />
    </div>
  )
}
