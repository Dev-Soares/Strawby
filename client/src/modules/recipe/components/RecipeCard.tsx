import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CookingPot, CaretDown, PencilSimple } from '@phosphor-icons/react'
import type { Recipe } from '../types/recipe'

export interface RecipeCardProps {
  recipe: Recipe
  isOpen: boolean
  onToggle: () => void
}

export default function RecipeCard({ recipe, isOpen, onToggle }: RecipeCardProps) {
  const navigate = useNavigate()
  const totalKcal = Math.round(recipe.totals?.calories ?? recipe.calories)

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md transition-colors duration-300">
      {/* Card body */}
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center gap-3 min-w-0 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-rose-50 dark:bg-rose-950/40 transition-colors duration-300">
            <CookingPot size={20} weight="bold" className="text-rose-600" />
          </div>
          <span className="text-lg font-extrabold truncate text-rose-700">
            {recipe.name}
          </span>
        </div>

        {/* Kcal */}
        <div className="mb-1">
          <span className="font-display text-4xl font-extrabold leading-none tabular-nums text-rose-600">
            {totalKcal}
          </span>
          <span className="text-base font-bold text-neutral-400 dark:text-neutral-500 ml-1.5">kcal</span>
        </div>

        {/* Macro chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {[
            { l: 'Proteína', v: Math.round(recipe.totals?.protein ?? recipe.protein) },
            { l: 'Carbos', v: Math.round(recipe.totals?.carbs ?? recipe.carbs) },
            { l: 'Gordura', v: Math.round(recipe.totals?.fat ?? recipe.fat) },
          ].map(({ l, v }) => (
            <span
              key={l}
              className="text-sm font-bold px-3.5 py-1.5 rounded-full tabular-nums bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 transition-colors duration-300"
            >
              {v}g {l}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors duration-150 cursor-pointer text-rose-700"
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
            <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 flex flex-col gap-2 transition-colors duration-300">
              {recipe.items && recipe.items.length > 0 ? (
                <>
                  {recipe.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0">
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
              ) : (
                <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500 py-2">Nenhum alimento adicionado</p>
              )}

              <button
                type="button"
                onClick={() => navigate(`/app/recipes/${recipe.id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-150 cursor-pointer"
              >
                <PencilSimple size={18} weight="bold" />
                Editar receita
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
