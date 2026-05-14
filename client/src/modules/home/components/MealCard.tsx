import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CoffeeIcon, ForkKnifeIcon, LeafIcon, MoonIcon, CookieIcon, CaretDownIcon, Trash, Plus } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Meal } from '../../meal/types/meal'
import { useDeleteMeal } from '../../meal/hooks/useDeleteMeal'
import { useDay } from '../contexts/DayContext'

interface MealConfig {
  icon: Icon
  label: string
  bg: string
  text: string
  accent: string
  divider: string
}

const mealConfig: Record<string, MealConfig> = {
  breakfast: {
    icon: CoffeeIcon,
    label: 'CAFÉ DA MANHÃ',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    accent: 'text-orange-600',
    divider: 'border-orange-100',
  },
  lunch: {
    icon: ForkKnifeIcon,
    label: 'ALMOÇO',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    accent: 'text-emerald-600',
    divider: 'border-emerald-100',
  },
  snack: {
    icon: LeafIcon,
    label: 'LANCHE',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    accent: 'text-blue-600',
    divider: 'border-blue-100',
  },
  dinner: {
    icon: MoonIcon,
    label: 'JANTAR',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    accent: 'text-violet-600',
    divider: 'border-violet-100',
  },
  supper: {
    icon: CookieIcon,
    label: 'CEIA',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    accent: 'text-slate-600',
    divider: 'border-slate-100',
  },
}

const fallbackConfig: MealConfig = {
  icon: CoffeeIcon,
  label: 'REFEIÇÃO',
  bg: 'bg-neutral-50',
  text: 'text-neutral-700',
  accent: 'text-neutral-600',
  divider: 'border-neutral-100',
}

interface MealCardProps {
  meal: Meal
  isOpen: boolean
  onToggle: () => void
}

export default function MealCard({ meal, isOpen, onToggle }: MealCardProps) {
  const navigate = useNavigate()
  const { isToday } = useDay()
  const deleteMutation = useDeleteMeal()
  const config = mealConfig[meal.mealType ?? ''] || fallbackConfig
  const MealIcon = config.icon

  const displayTime = meal.time
    ?? new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-5 p-3 sm:p-5 cursor-pointer text-left"
      >
        <div
          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${config.bg}`}
        >
          <MealIcon size={20} weight="bold" className={`${config.text} sm:hidden`} />
          <MealIcon size={26} weight="bold" className={`${config.text} hidden sm:block`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <p className="text-[13px] sm:text-sm font-bold text-neutral-900 truncate">
              {meal.name}
            </p>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
            <span className="font-bold text-neutral-500 mr-1.5 tabular-nums sm:hidden">
              {displayTime}
            </span>
            {meal.items.length} {meal.items.length === 1 ? 'alimento' : 'alimentos'}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden sm:inline text-[10px] text-neutral-400 font-bold tabular-nums">
            {displayTime}
          </span>
          <div className="text-right min-w-10 sm:min-w-12">
            <p className={`text-base sm:text-xl font-extrabold leading-none tabular-nums ${config.accent}`}>
              {Math.round(meal.totals.calories)}
            </p>
            <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5 sm:mt-1">
              kcal
            </p>
          </div>
          <CaretDownIcon
            size={16}
            weight="bold"
            className={`${config.accent} transition-transform duration-250`}
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className={`border-t ${config.divider} bg-neutral-50/50 p-3 sm:p-4 flex flex-col gap-2`}>
              {meal.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl px-3.5 sm:px-4 py-3 border border-neutral-100"
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="min-w-0 flex items-baseline gap-2">
                      <p className="text-[13px] sm:text-sm font-bold text-neutral-900 truncate">
                        {item.food.name}
                      </p>
                      <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 tabular-nums shrink-0">
                        {Math.round(item.quantity)}g
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className={`text-base sm:text-lg font-extrabold tabular-nums leading-none ${config.accent}`}>
                        {Math.round(item.calories)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                        kcal
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-lg px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-900 tabular-nums">
                        {Math.round(item.protein)}<span className="text-amber-700 font-bold">g</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-amber-800 ml-auto">
                        Prot
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-100 border border-blue-200 rounded-lg px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-900 tabular-nums">
                        {Math.round(item.carbs)}<span className="text-blue-700 font-bold">g</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-blue-800 ml-auto">
                        Carb
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-violet-100 border border-violet-200 rounded-lg px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-violet-900 tabular-nums">
                        {Math.round(item.fat)}<span className="text-violet-700 font-bold">g</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-violet-800 ml-auto">
                        Gord
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isToday && (
                <button
                  type="button"
                  onClick={() => navigate(`/foods/select?mealId=${meal.id}&type=meal`)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold hover:bg-neutral-200 transition-colors duration-150 cursor-pointer"
                >
                  <Plus size={14} weight="bold" />
                  Adicionar alimento
                </button>
              )}

              <button
                type="button"
                onClick={() => deleteMutation.mutate(meal.id)}
                disabled={deleteMutation.isPending}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors duration-150 cursor-pointer mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? (
                  <span className="inline-block w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                ) : (
                  <Trash size={14} weight="bold" />
                )}
                {deleteMutation.isPending ? 'Removendo…' : 'Remover refeição'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
