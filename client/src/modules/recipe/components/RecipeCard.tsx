import { useNavigate } from 'react-router-dom'
import { CookingPot } from '@phosphor-icons/react'
import type { RecipeSummary } from '../types/recipe'

export interface RecipeCardProps {
  recipe: RecipeSummary
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate()
  const totalKcal = Math.round(recipe.totals?.calories ?? recipe.calories)

  return (
    <div
      onClick={() => navigate(`/app/recipes/${recipe.id}`)}
      className="bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 min-w-0 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-rose-50">
            <CookingPot size={20} weight="bold" className="text-rose-600" />
          </div>
          <span className="text-lg font-extrabold truncate text-rose-700">
            {recipe.name}
          </span>
        </div>

        <div className="mb-1">
          <span className="font-display text-4xl font-extrabold leading-none tabular-nums text-rose-600">
            {totalKcal}
          </span>
          <span className="text-base font-bold text-neutral-400 ml-1.5">kcal</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {[
            { l: 'Proteína', v: Math.round(recipe.totals?.protein ?? recipe.protein) },
            { l: 'Carbos', v: Math.round(recipe.totals?.carbs ?? recipe.carbs) },
            { l: 'Gordura', v: Math.round(recipe.totals?.fat ?? recipe.fat) },
          ].map(({ l, v }) => (
            <span
              key={l}
              className="text-sm font-bold px-3.5 py-1.5 rounded-full tabular-nums bg-rose-50 text-rose-700"
            >
              {v}g {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
