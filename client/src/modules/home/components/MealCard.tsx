import { Coffee, ForkKnife, Leaf, Moon, Cookie, ArrowRight } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Meal, MealType } from '../types/meal'

interface MealConfig {
  icon: Icon
  label: string
  bg: string
  text: string
  accent: string
}

const mealConfig: Record<MealType, MealConfig> = {
  breakfast: {
    icon: Coffee,
    label: 'CAFÉ DA MANHÃ',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    accent: 'text-orange-600',
  },
  lunch: {
    icon: ForkKnife,
    label: 'ALMOÇO',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    accent: 'text-emerald-600',
  },
  snack: {
    icon: Leaf,
    label: 'LANCHE',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    accent: 'text-blue-600',
  },
  dinner: {
    icon: Moon,
    label: 'JANTAR',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    accent: 'text-violet-600',
  },
  supper: {
    icon: Cookie,
    label: 'CEIA',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    accent: 'text-slate-600',
  },
}

interface MealCardProps {
  meal: Meal
}

export default function MealCard({ meal }: MealCardProps) {
  const config = mealConfig[meal.mealType]
  const MealIcon = config.icon

  return (
    <div className="group flex items-center gap-5 bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.bg}`}
      >
        <MealIcon size={26} weight="bold" className={config.text} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-bold text-neutral-900 truncate">{meal.name}</p>
          <span
            className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full shrink-0 ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        </div>
        <p className="text-xs text-neutral-400 truncate">{meal.foods.join(' · ')}</p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[10px] text-neutral-400 font-bold tabular-nums">{meal.time}</span>
        <div className="text-right min-w-[3rem]">
          <p className={`text-xl font-black leading-none tabular-nums ${config.accent}`}>
            {meal.kcal}
          </p>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide mt-1">kcal</p>
        </div>
        <ArrowRight
          size={14}
          className="text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all duration-200"
        />
      </div>
    </div>
  )
}
