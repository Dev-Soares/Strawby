import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import FoodSearch from '../modules/food/components/FoodSearch'
import FoodGrid from '../modules/food/components/FoodGrid'
import FoodSkeleton from '../modules/food/skeletons/FoodSkeleton'
import { useSearchFood } from '../modules/food/hooks/useSearchFood'

export default function FoodsPage() {
  const [search, setSearch] = useState('')
  const { data: foods, isPending, isError } = useSearchFood(search)

  const renderContent = () => {
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
            Nenhum resultado para "{search}"
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
          <p className="text-sm text-neutral-500 mt-3">Mais de 10.000 alimentos na base de dados</p>
        </div>

        <div className="mb-6">
          <FoodSearch value={search} onChange={setSearch} />
        </div>

        {renderContent()}
      </div>
    </AppLayout>
  )
}
