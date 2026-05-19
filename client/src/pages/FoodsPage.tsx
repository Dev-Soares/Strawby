import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import FoodSearch from '../modules/food/components/FoodSearch'
import FoodGrid from '../modules/food/components/FoodGrid'
import FoodSkeleton from '../modules/food/skeletons/FoodSkeleton'
import PrivateFoodManager from '../modules/privateFood/components/PrivateFoodManager'
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
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <MagnifyingGlass size={26} weight="bold" className="text-red-400" />
          </div>
          <p className="text-base font-semibold text-neutral-700 mb-1">Busque um alimento</p>
          <p className="text-sm text-neutral-400 max-w-xs">
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
          <p className="text-xs text-neutral-400">Verifique sua conexão e tente novamente</p>
        </div>
      )
    }

    if (!foods || foods.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-semibold text-neutral-600 mb-1">
            Nenhum resultado para &quot;{search}&quot;
          </p>
          <p className="text-xs text-neutral-400">Tente um nome diferente ou mais genérico</p>
        </div>
      )
    }

    return <FoodGrid foods={foods} total={foods.length} />
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none">
            Alimentos
          </h1>
          <p className="text-sm text-neutral-500 mt-3">Busque na base pública, gerencie seus alimentos privados ou monte receitas</p>
        </div>

        <div className="flex gap-1 mb-6 bg-neutral-100 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer px-2 sm:px-3 ${
                tab === t.key
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
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
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900">Suas receitas</h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
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
