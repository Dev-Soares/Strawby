import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import FoodSearch from '../modules/food/components/FoodSearch'
import FoodGrid from '../modules/food/components/FoodGrid'
import FoodSkeleton from '../modules/food/skeletons/FoodSkeleton'
import PrivateFoodManager from '../modules/private-food/components/PrivateFoodManager'
import RecipeList from '../modules/recipe/components/RecipeList'
import { useSearchFood } from '../modules/food/hooks/useSearchFood'

type Tab = 'search' | 'private' | 'recipes'

export default function FoodsPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('search')
  const [search, setSearch] = useState('')
  const { data: foods, isPending, isError } = useSearchFood(search)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'search', label: 'Buscar' },
    { key: 'private', label: 'Meus alimentos' },
    { key: 'recipes', label: 'Receitas' },
  ]

  const renderSearchContent = () => {
    if (search.trim().length < 2) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-5 transition-colors duration-300">
            <MagnifyingGlass size={26} weight="bold" className="text-red-400" />
          </div>
          <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">Busque um alimento</p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs transition-colors duration-300">
            Digite o nome de qualquer alimento para ver suas informações nutricionais
          </p>
        </div>
      )
    }

    if (isPending) return <FoodSkeleton />

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-red-500 mb-1">Erro ao buscar alimentos</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">Verifique sua conexão e tente novamente</p>
        </div>
      )
    }

    if (!foods || foods.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1 transition-colors duration-300">
            Nenhum resultado para &quot;{search}&quot;
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">Tente um nome diferente ou mais genérico</p>
        </div>
      )
    }

    return <FoodGrid foods={foods} total={foods.length} />
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
            Alimentos
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 transition-colors duration-300">Busque na base pública, gerencie seus alimentos privados ou monte receitas</p>
        </div>

        <div data-tutorial="foods-tabs" className="flex gap-1 mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 transition-colors duration-300">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer px-2 sm:px-3 ${
                tab === t.key
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'search' ? (
          <div>
            <div className="mb-6">
              <FoodSearch value={search} onChange={setSearch} />
            </div>
            {renderSearchContent()}
          </div>
        ) : tab === 'private' ? (
          <PrivateFoodManager />
        ) : (
          <div className="max-w-3xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-200 transition-colors duration-300">Suas receitas</h2>
                <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                  Monte receitas para reutilizar nas refeições
                </p>
              </div>
              <button
                onClick={() => navigate('/app/recipes/new')}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer shrink-0"
              >
                <Plus size={16} weight="bold" />
                Nova receita
              </button>
            </div>
            <RecipeList />
          </div>
        )}
      </div>
    </AppLayout>
  )
}
