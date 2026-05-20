import { useNavigate } from 'react-router-dom'
import { Plus, CookingPot } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import RecipeCard from '../modules/recipe/components/RecipeCard'
import RecipeCardSkeleton from '../modules/recipe/skeletons/RecipeCardSkeleton'
import { useGetRecipes } from '../modules/recipe/hooks/useGetRecipes'

export default function RecipesPage() {
  const navigate = useNavigate()
  const { data: recipes, isPending, isError } = useGetRecipes()

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none">
              Receitas
            </h1>
            <p className="text-sm text-neutral-500 mt-3">Monte receitas para reutilizar nas refeições</p>
          </div>
          <button
            onClick={() => navigate('/app/recipes/new')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-colors duration-200 cursor-pointer shrink-0"
          >
            <Plus size={16} weight="bold" />
            Nova receita
          </button>
        </div>

        {isPending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-semibold text-red-500 mb-1">Erro ao carregar receitas</p>
            <p className="text-xs text-neutral-400">Verifique sua conexão e tente novamente</p>
          </div>
        )}

        {!isPending && !isError && recipes && recipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-neutral-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <CookingPot size={28} weight="bold" className="text-rose-300" />
            </div>
            <p className="text-sm font-semibold text-neutral-600 mb-1">Nenhuma receita ainda</p>
            <p className="text-xs text-neutral-400 mb-6 max-w-xs">
              Crie sua primeira receita para montar refeições mais rapidamente
            </p>
            <button
              onClick={() => navigate('/app/recipes/new')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-colors duration-200 cursor-pointer"
            >
              <Plus size={16} weight="bold" />
              Criar receita
            </button>
          </div>
        )}

        {!isPending && !isError && recipes && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
