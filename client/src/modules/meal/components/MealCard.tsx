import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CoffeeIcon, ForkKnifeIcon, LeafIcon, MoonIcon, CookieIcon, CaretDown, PencilSimple } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Meal } from '../types/meal'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'

export interface MealTypeConfig {
  icon: Icon
  label: string
  accent: string
  accentLight: string
  accentText: string
}

export const mealTypeConfig: Record<string, MealTypeConfig> = {
  breakfast: { icon: CoffeeIcon, label: 'MANHÃ', accent: '#ea580c', accentLight: '#fed7aa', accentText: '#c2410c' },
  lunch: { icon: ForkKnifeIcon, label: 'ALMOÇO', accent: '#16a34a', accentLight: '#bbf7d0', accentText: '#15803d' },
  snack: { icon: LeafIcon, label: 'LANCHE', accent: '#2563eb', accentLight: '#bfdbfe', accentText: '#1d4ed8' },
  dinner: { icon: MoonIcon, label: 'JANTAR', accent: '#9333ea', accentLight: '#e9d5ff', accentText: '#7e22ce' },
  supper: { icon: CookieIcon, label: 'CEIA', accent: '#475569', accentLight: '#cbd5e1', accentText: '#334155' },
}

export const fallbackConfig: MealTypeConfig = {
  icon: CoffeeIcon,
  label: 'REFEIÇÃO',
  accent: '#475569',
  accentLight: '#cbd5e1',
  accentText: '#334155',
}

export interface MealCardProps {
  meal: Meal
  isOpen: boolean
  onToggle: () => void
}

export default function MealCard({ meal, isOpen, onToggle }: MealCardProps) {
  const navigate = useNavigate()
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const config = mealTypeConfig[meal.mealType ?? ''] || fallbackConfig
  const MealIcon = config.icon
  const totalKcal = Math.round(meal.totals.calories)

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
            className="transition-transform duration-250"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
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
            <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 flex flex-col gap-2">
              {meal.items && meal.items.length > 0 && (
                <>
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-200 truncate">
                          {(item.food ?? item.privateFood)?.name ?? 'Alimento'}
                        </p>
                        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                          {Math.round(item.quantity)}g
                        </p>
                      </div>
                      <span className="text-sm font-extrabold tabular-nums text-neutral-700 dark:text-neutral-300 shrink-0">
                        {Math.round(item.calories)} kcal
                      </span>
                    </div>
                  ))}
                </>
              )}

              {meal.recipes && meal.recipes.length > 0 && (
                <>
                  {meal.items && meal.items.length > 0 && (
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
                  )}
                  {meal.recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-200 truncate">
                          {recipe.name}
                        </p>
                        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                          Receita
                        </p>
                      </div>
                      <span className="text-sm font-extrabold tabular-nums text-neutral-700 dark:text-neutral-300 shrink-0">
                        {Math.round(recipe.calories)} kcal
                      </span>
                    </div>
                  ))}
                </>
              )}

              {(!meal.items || meal.items.length === 0) && (!meal.recipes || meal.recipes.length === 0) && (
                <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 py-2">Nenhum alimento adicionado</p>
              )}

              <button
                type="button"
                onClick={() => navigate(`/app/meals/${meal.id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-300 cursor-pointer"
              >
                <PencilSimple size={18} weight="bold" />
                Editar refeição
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
