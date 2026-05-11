import { Fire } from '@phosphor-icons/react'
import type { Food } from '../types/food'

interface FoodCardProps {
  food: Food
}

const macros = [
  { key: 'protein' as const, label: 'P', color: '#f59e0b' },
  { key: 'carbs' as const, label: 'C', color: '#3b82f6' },
  { key: 'fat' as const, label: 'G', color: '#a855f7' },
]

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <div className="group bg-white border border-neutral-200 rounded-2xl p-4 hover:border-neutral-300 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="mb-3">
        <p className="text-sm font-semibold text-neutral-900 group-hover:text-red-600 transition-colors duration-200 leading-snug mb-0.5">
          {food.name}
        </p>
        <p className="text-xs font-medium text-neutral-400">por 100g</p>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
        <span className="text-xl font-extrabold text-neutral-900 tabular-nums leading-none">
          {Math.round(food.calories)}
        </span>
        <span className="text-xs font-medium text-neutral-400 pb-0.5">kcal</span>
      </div>

      <div className="flex gap-3">
        {macros.map(({ key, label, color }) => (
          <div key={key} className="flex-1">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">{label}</span>
              <span className="text-xs font-bold text-neutral-700 tabular-nums">{food[key]}g</span>
            </div>
            <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min((food[key] / 50) * 100, 100)}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
