import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Clock, Pencil, Plus, StickyNote } from 'lucide-react'
import type { Meal } from '../types/meal'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import { getMealAccent, getMealType } from '@/shared/config/mealTypes'
import { CALORIES, MACROS } from '@/shared/config/macros'
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
  const reduceMotion = useReducedMotion()
  const config = getMealType(meal.mealType)
  const MealIcon = config.icon
  const CaloriesIcon = CALORIES.icon
  const totalKcal = Math.round(meal.totals.calories)
  const editModal = useEditMealModal({ mealId: meal.id })

  // Paleta do card: um hue só, derivado do tipo da refeição.
  const { surface: accentSurface, ink: accentInk, strong: accentStrong } = getMealAccent(config, isDark)

  const items = meal.items ?? []
  const recipes = meal.recipes ?? []
  const detailId = `meal-${meal.id}-detalhe`

  // Prévia do conteúdo: é o que a pessoa procura ao percorrer o diário,
  // e antes só aparecia depois de expandir o card.
  const contents = [
    ...items.map((item) => (item.food ?? item.privateFood)?.name ?? 'Alimento'),
    ...recipes.map((recipe) => recipe.name),
  ]

  // Refeição de plano é template: só mostra hora definida.
  // Diário deriva do timestamp de registro quando não há hora explícita.
  const displayTime =
    meal.kind === 'PLAN'
      ? meal.time
      : (meal.time ??
        new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: accentSurface }}
          >
            <MealIcon size={23} style={{ color: accentInk }} />
          </span>

          <h3
            className="min-w-0 flex-1 truncate font-display text-lg font-extrabold leading-none tracking-tight sm:text-xl"
            style={{ color: accentInk }}
          >
            {meal.name}
          </h3>

          {displayTime && (
            <span
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: accentSurface }}
            >
              <Clock size={16} style={{ color: accentStrong }} />
              <span
                className="text-sm font-extrabold leading-none tabular-nums"
                style={{ color: accentInk }}
              >
                {displayTime}
              </span>
            </span>
          )}
        </div>

        <p
          className="mt-3 ml-2 pr-10 sm:pr-16 min-h-11 line-clamp-2 text-base font-medium leading-snug text-pretty transition-colors duration-300"
          style={{ color: accentInk }}
        >
          {contents.length > 0 ? contents.join(', ') : 'Nenhum alimento registrado'}
        </p>

        {meal.observations && (
          <div
            className="mt-3 flex w-fit max-w-full items-start gap-2.5 rounded-xl p-3"
            style={{ backgroundColor: accentSurface }}
          >
            <StickyNote size={17} className="mt-0.5 shrink-0" style={{ color: accentStrong }} />
            <p className="text-sm font-semibold leading-relaxed" style={{ color: accentInk }}>
              {meal.observations}
            </p>
          </div>
        )}

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
            style={{ backgroundColor: accentSurface, color: accentInk }}
          >
            <CaloriesIcon size={18} style={{ color: accentStrong }} />
            {totalKcal.toLocaleString('pt-BR')} kcal
          </span>

          {MACROS.map((macro) => {
            const MacroIcon = macro.icon
            return (
              <span
                key={macro.field}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
                style={{ backgroundColor: accentSurface, color: accentInk }}
              >
                <MacroIcon size={18} style={{ color: accentStrong }} />
                {Math.round(meal.totals[macro.field])}g {macro.label}
              </span>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={detailId}
        className="flex w-full cursor-pointer items-center justify-between border-t border-neutral-100 px-4 py-3 transition-colors duration-200 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:border-neutral-800 dark:hover:bg-neutral-800/50 dark:focus-visible:ring-neutral-500 sm:px-5"
        style={{ color: accentInk }}
      >
        <span className="text-sm font-bold">Ver detalhes</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-250 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={detailId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-t border-neutral-100 px-4 py-4 dark:border-neutral-800 sm:px-5">
              {items.length > 0 && (
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-baseline gap-3 py-2.5 first:pt-0">
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {(item.food ?? item.privateFood)?.name ?? 'Alimento'}
                      </span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-neutral-600 dark:text-neutral-300">
                        {Math.round(item.quantity)}g
                      </span>
                      <span
                        className="w-20 shrink-0 text-right text-sm font-extrabold tabular-nums"
                        style={{ color: accentInk }}
                      >
                        {Math.round(item.calories)}
                        <span className="ml-1 text-xs font-semibold text-neutral-400 dark:text-neutral-500">kcal</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {recipes.length > 0 && (
                <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {recipes.map((recipe) => (
                    <li key={recipe.id} className="flex items-baseline gap-3 py-2.5 first:pt-0">
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {recipe.name}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                        receita
                      </span>
                      <span
                        className="w-20 shrink-0 text-right text-sm font-extrabold tabular-nums"
                        style={{ color: accentInk }}
                      >
                        {Math.round(recipe.calories)}
                        <span className="ml-1 text-xs font-semibold text-neutral-400 dark:text-neutral-500">kcal</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={editModal.open}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-opacity duration-200 hover:opacity-80"
                  style={{ backgroundColor: accentSurface, color: accentInk }}
                >
                  <Pencil size={16} />
                  Editar refeição
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/app/meals/${meal.id}`)}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:brightness-110"
                  style={{ backgroundColor: config.accent }}
                >
                  <Plus size={16} />
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
