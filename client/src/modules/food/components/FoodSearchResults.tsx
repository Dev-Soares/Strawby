import { MagnifyingGlass } from '@phosphor-icons/react'
import FoodGrid from './FoodGrid'
import FoodSkeleton from '../skeletons/FoodSkeleton'
import { canSearch } from '../config/search'
import type { Food } from '../types/food'

const SKELETON_COUNT = 9

interface Props {
  search: string
  foods: Food[] | undefined
  isPending: boolean
  isError: boolean
}

export default function FoodSearchResults({ search, foods, isPending, isError }: Props) {
  if (!canSearch(search)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-5 transition-colors duration-300">
          <MagnifyingGlass size={26} weight="bold" className="text-red-400" />
        </div>
        <p className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">
          Busque um alimento
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs transition-colors duration-300">
          Digite o nome de qualquer alimento para ver suas informações nutricionais
        </p>
      </div>
    )
  }

  if (isPending) {
    return (
      <div>
        <div className="h-4 w-36 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <FoodSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-semibold text-red-500 mb-1">Erro ao buscar alimentos</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
          Verifique sua conexão e tente novamente
        </p>
      </div>
    )
  }

  if (!foods || foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1 transition-colors duration-300">
          Nenhum resultado para &quot;{search}&quot;
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
          Tente um nome diferente ou mais genérico
        </p>
      </div>
    )
  }

  return <FoodGrid foods={foods} total={foods.length} />
}
