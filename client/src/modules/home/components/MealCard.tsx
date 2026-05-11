import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CoffeeIcon, ForkKnifeIcon, LeafIcon, MoonIcon, CookieIcon, CaretDownIcon } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Meal, MealType } from '../types/meal'

interface MealConfig {
  icon: Icon
  label: string
  bg: string
  text: string
  accent: string
  divider: string
}

const mealConfig: Record<MealType, MealConfig> = {
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

interface MealCardProps {
  meal: Meal
}

export default function MealCard({ meal }: MealCardProps) {
  const config = mealConfig[meal.mealType]
  const MealIcon = config.icon
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
            <span
              className={`hidden sm:inline-block text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full shrink-0 ${config.bg} ${config.text}`}
            >
              {config.label}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
            <span className="font-bold text-neutral-500 mr-1.5 tabular-nums sm:hidden">
              {meal.time}
            </span>
            {meal.foods.length} {meal.foods.length === 1 ? 'alimento' : 'alimentos'}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden sm:inline text-[10px] text-neutral-400 font-bold tabular-nums">
            {meal.time}
          </span>
          <div className="text-right min-w-10 sm:min-w-12">
            <p className={`text-base sm:text-xl font-black leading-none tabular-nums ${config.accent}`}>
              {meal.kcal}
            </p>
            <p className="text-[8px] sm:text-[9px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5 sm:mt-1">
              kcal
            </p>
          </div>
          <CaretDownIcon
            size={16}
            weight="bold"
            className={`${config.accent} transition-transform duration-250`}
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className={`border-t ${config.divider} bg-neutral-50/50 p-3 sm:p-4 flex flex-col gap-2`}>
              {meal.foods.map((food) => (
                <div
                  key={food.name}
                  className="bg-white rounded-xl px-3.5 sm:px-4 py-3 border border-neutral-100"
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="min-w-0 flex items-baseline gap-2">
                      <p className="text-[13px] sm:text-sm font-bold text-neutral-900 truncate">
                        {food.name}
                      </p>
                      <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 tabular-nums shrink-0">
                        {food.grams}g
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className={`text-base sm:text-lg font-black tabular-nums leading-none ${config.accent}`}>
                        {food.kcal}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                        kcal
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-200 rounded-lg px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-black text-amber-900 tabular-nums">
                        {food.protein}<span className="text-amber-700 font-bold">g</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-amber-800 ml-auto">
                        P
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-100 border border-blue-200 rounded-lg px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-black text-blue-900 tabular-nums">
                        {food.carbs}<span className="text-blue-700 font-bold">g</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-blue-800 ml-auto">
                        C
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-violet-100 border border-violet-200 rounded-lg px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-black text-violet-900 tabular-nums">
                        {food.fat}<span className="text-violet-700 font-bold">g</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-violet-800 ml-auto">
                        G
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
