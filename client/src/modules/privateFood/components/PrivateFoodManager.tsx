import { useState } from 'react'
import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import FoodSearch from '../../food/components/FoodSearch'
import PrivateFoodList from './PrivateFoodList'
import PrivateFoodModal from './PrivateFoodModal'
import PrivateFoodSkeleton from '../skeletons/PrivateFoodSkeleton'
import { useGetPrivateFoods } from '../hooks/useGetPrivateFoods'
import { usePrivateFoodForm } from '../hooks/usePrivateFoodForm'
import type { PrivateFood } from '../types/privateFood'

export default function PrivateFoodManager() {
  const [isOpen, setIsOpen] = useState(false)
  const form = usePrivateFoodForm({
    onSuccess: () => setIsOpen(false),
  })
  const { data: privateFoods, isPending, isError } = useGetPrivateFoods()
  const [search, setSearch] = useState('')

  const filteredFoods =
    search.trim().length < 2
      ? (privateFoods ?? [])
      : (privateFoods ?? []).filter((f) => f.name.toLowerCase().includes(search.trim().toLowerCase()))

  const openCreate = () => {
    form.startCreate()
    setIsOpen(true)
  }

  const openEdit = (food: PrivateFood) => {
    form.startEdit(food)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    form.startCreate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-neutral-950">Meus alimentos</h2>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm shadow-red-200"
        >
          <Plus size={16} weight="bold" />
          Criar alimento
        </button>
      </div>

      <PrivateFoodModal
        isOpen={isOpen}
        onClose={handleClose}
        register={form.register}
        errors={form.formState.errors}
        mode={form.mode}
        isPending={form.isPending}
        onSubmit={form.onSubmit}
        onCancel={handleClose}
      />

      <div>
        <div className="mb-4">
          <FoodSearch value={search} onChange={setSearch} />
        </div>

        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <PrivateFoodSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-semibold text-red-500 mb-1">Erro ao carregar alimentos</p>
            <p className="text-xs text-neutral-400">Verifique sua conexão e tente novamente</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
              <MagnifyingGlass size={22} weight="bold" className="text-neutral-400" />
            </div>
            <p className="text-sm font-semibold text-neutral-600 mb-1">
              {search.trim().length >= 2 ? `Nenhum resultado para "${search}"` : 'Nenhum alimento cadastrado'}
            </p>
            <p className="text-xs text-neutral-400">
              {search.trim().length >= 2
                ? 'Tente outro termo de busca'
                : 'Cadastre seu primeiro alimento'}
            </p>
          </div>
        ) : (
          <PrivateFoodList foods={filteredFoods} onEdit={openEdit} />
        )}
      </div>
    </div>
  )
}
