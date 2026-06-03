import FoodSearch from './FoodSearch'
import FoodSkeleton from '../skeletons/FoodSkeleton'
import PrivateFoodSkeleton from '../../private-food/skeletons/PrivateFoodSkeleton'
import RecipeCardSkeleton from '../../recipe/skeletons/RecipeCardSkeleton'
import SelectFoodTabs from './SelectFoodTabs'
import SelectableFoodCard from './SelectableFoodCard'
import type { SelectFoodTab, SelectableItem } from '../types/selectableItem'

type Props = {
  tab: SelectFoodTab
  onTabChange: (tab: SelectFoodTab) => void
  includeRecipes: boolean
  search: string
  onSearchChange: (value: string) => void
  isPending: boolean
  isError: boolean
  items: SelectableItem[]
  onSelect: (item: SelectableItem) => void
}

export default function SelectFoodSearchView({
  tab, onTabChange, includeRecipes, search, onSearchChange,
  isPending, isError, items, onSelect,
}: Props) {
  const showInitialPrompt = tab === 'public' && search.trim().length < 2
  const isEmpty = !items || items.length === 0

  return (
    <div>
      <SelectFoodTabs tab={tab} onChange={onTabChange} includeRecipes={includeRecipes} />

      {tab === 'public' && (
        <div className="mb-6">
          <FoodSearch value={search} onChange={onSearchChange} />
        </div>
      )}

      {showInitialPrompt ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mb-1 transition-colors duration-300">
            Busque um alimento
          </p>
          <p className="text-xs text-neutral-300 dark:text-neutral-600 max-w-xs transition-colors duration-300">
            Digite o nome de qualquer alimento para ver suas informações nutricionais
          </p>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) =>
            tab === 'recipes'
              ? <RecipeCardSkeleton key={i} />
              : tab === 'public'
                ? <FoodSkeleton key={i} />
                : <PrivateFoodSkeleton key={i} />,
          )}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-red-500 mb-1">
            {tab === 'recipes' ? 'Erro ao buscar receitas' : 'Erro ao buscar alimentos'}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">Verifique sua conexão e tente novamente</p>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1 transition-colors duration-300">
            {tab === 'public' ? `Nenhum resultado para "${search}"` : tab === 'private' ? 'Nenhum alimento cadastrado' : 'Nenhuma receita cadastrada'}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
            {tab === 'public'
              ? 'Tente um nome diferente ou mais genérico'
              : tab === 'private'
                ? 'Você ainda não cadastrou nenhum alimento privado'
                : 'Você ainda não cadastrou nenhuma receita'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <SelectableFoodCard key={`${item.kind}-${item.id}`} item={item} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
