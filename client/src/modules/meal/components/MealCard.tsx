import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CoffeeIcon, ForkKnifeIcon, LeafIcon, MoonIcon, CookieIcon, CaretDown, PencilSimple } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Meal } from '../types/meal'

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
  const config = mealTypeConfig[meal.mealType ?? ''] || fallbackConfig
  const MealIcon = config.icon
  const totalKcal = Math.round(meal.totals.calories)

  return (
    <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Card body */}
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: config.accentLight }}
          >
            <MealIcon size={16} weight="bold" style={{ color: config.accentText }} />
          </div>
          <span
            className="text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-full"
            style={{ backgroundColor: config.accentLight, color: config.accentText }}
          >
            {config.label}
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
          <span className="text-base font-bold text-neutral-400 ml-1.5">kcal</span>
        </div>
        <p
          className="font-display text-sm font-bold mb-0.5"
          style={{ color: config.accentText }}
        >
          {meal.name}
        </p>

        {/* Macro chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {[
            { l: 'Proteína', v: Math.round(meal.totals.protein) },
            { l: 'Carbos', v: Math.round(meal.totals.carbs) },
            { l: 'Gordura', v: Math.round(meal.totals.fat) },
          ].map(({ l, v }) => (
            <span
              key={l}
              className="text-xs font-bold px-2.5 py-1 rounded-full tabular-nums"
              style={{ backgroundColor: config.accentLight, color: config.accentText }}
            >
              {v}g {l}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
          style={{ color: config.accentText }}
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
            <div className="border-t border-neutral-100 px-4 py-3 flex flex-col gap-2">
              {meal.items && meal.items.length > 0 ? (
                <>
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-neutral-900 truncate">
                          {item.food.name}
                        </p>
                        <p className="text-xs font-bold text-neutral-400">
                          {Math.round(item.quantity)}g
                        </p>
                      </div>
                      <span className="text-sm font-extrabold tabular-nums text-neutral-700 shrink-0">
                        {Math.round(item.calories)} kcal
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-xs text-neutral-400">Nenhum alimento adicionado</p>
              )}

              <button
                type="button"
                onClick={() => navigate(`/meals/${meal.id}`)}
                className="mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors duration-150 cursor-pointer"
              >
                <PencilSimple size={14} weight="bold" />
                Editar refeição
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
