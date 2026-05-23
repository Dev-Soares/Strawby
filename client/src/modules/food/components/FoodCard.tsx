import { Fire } from '@phosphor-icons/react'
import type { Food } from '../types/food'

interface FoodCardProps {
  food: Food
}

const macros = [
  { key: 'protein' as const, label: 'Prot', colorClass: 'text-amber-500' },
  { key: 'carbs' as const, label: 'Carb', colorClass: 'text-blue-500' },
  { key: 'fat' as const, label: 'Gord', colorClass: 'text-violet-500' },
]

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="mb-3">
        <p className="text-base font-bold text-neutral-950 dark:text-neutral-100 group-hover:text-red-600 transition-colors duration-200 leading-snug mb-0.5">
          {food.name}
        </p>
        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 transition-colors duration-300">por 100g</p>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
        <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-200 tabular-nums leading-none transition-colors duration-300">
          {Math.round(food.calories)}
        </span>
        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 pb-0.5 transition-colors duration-300">kcal</span>
      </div>

      <div className="flex gap-4">
        {macros.map(({ key, label, colorClass }) => (
          <div key={key} className="flex-1 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-1 transition-colors duration-300">{label}</span>
            <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
              {food[key]}g
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
