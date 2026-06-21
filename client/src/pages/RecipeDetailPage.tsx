import { useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import Spinner from '@/shared/components/Spinner'
import RecipeDetailSkeleton from '@/modules/recipe/skeletons/RecipeDetailSkeleton'
import RecipeTotalsCard from '@/modules/recipe/components/RecipeTotalsCard'
import RecipeItemRow from '@/modules/recipe/components/RecipeItemRow'
import RecipeNameEditor from '@/modules/recipe/components/RecipeNameEditor'
import { useRecipeDetailPage } from '@/modules/recipe/hooks/useRecipeDetailPage'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()

  const {
    recipe, isLoading, isError, confirm, setConfirm, handleConfirm, isDeletePending,
    deleteMutation, removeItem, updateMutation,
    isEditingName, editName, setEditName, startEditingName, saveName, setIsEditingName,
    navigate,
  } = useRecipeDetailPage(id ?? '')

  if (isLoading) {
    return (
      <AppLayout>
        <RecipeDetailSkeleton />
      </AppLayout>
    )
  }

  if (isError || !recipe) {
    return (
      <AppLayout>
        <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-red-500 mb-1">Erro ao carregar receita</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-6">Verifique sua conexão e tente novamente.</p>
          <button
            type="button"
            onClick={() => navigate('/app/foods')}
            className="py-3 px-6 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 cursor-pointer"
          >
            Voltar para alimentos
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/app/foods')}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            Voltar
          </button>
          <RecipeNameEditor
            name={recipe.name}
            isEditing={isEditingName}
            editName={editName}
            isPending={updateMutation.isPending}
            onChange={setEditName}
            onStart={() => startEditingName(recipe.name)}
            onSave={saveName}
            onCancel={() => setIsEditingName(false)}
          />
        </div>

        <RecipeTotalsCard totals={recipe.totals} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
            Alimentos ({recipe.items.length})
          </h2>
        </div>

        {recipe.items.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center transition-colors duration-300">
            <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mb-1">Nenhum alimento</p>
            <p className="text-xs text-neutral-300 dark:text-neutral-600 mb-4">Adicione alimentos para compor esta receita</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipe.items.map((item) => (
              <RecipeItemRow
                key={item.id}
                item={item}
                isRemovePending={removeItem.isPending}
                onRemove={(it) =>
                  setConfirm({
                    type: 'recipeItem',
                    recipeId: recipe.id,
                    itemId: it.id,
                    name: (it.food ?? it.privateFood)?.name ?? 'Alimento',
                  })
                }
              />
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(`/app/foods/select?recipeId=${recipe.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md transition-colors duration-150 cursor-pointer hover:brightness-110 bg-rose-600"
          >
            <Plus size={16} weight="bold" />
            Adicionar alimento
          </button>

          <button
            type="button"
            onClick={() => setConfirm({ type: 'recipe', id: recipe.id, name: recipe.name })}
            disabled={deleteMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? (
              <Spinner size={16} className="border-white/40 border-t-white" />
            ) : (
              <Trash size={16} weight="bold" />
            )}
            {deleteMutation.isPending ? 'Removendo…' : 'Remover receita'}
          </button>
        </div>

        <ConfirmDeleteModal
          isOpen={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={handleConfirm}
          title={
            confirm?.type === 'recipe'
              ? `Remover receita "${confirm.name}"?`
              : confirm?.type === 'recipeItem'
                ? `Remover "${confirm.name}"?`
                : 'Tem certeza?'
          }
          description={
            confirm?.type === 'recipe'
              ? 'A receita será excluída permanentemente.'
              : confirm?.type === 'recipeItem'
                ? 'O alimento será removido desta receita.'
                : 'Esta ação não pode ser desfeita.'
          }
          confirmLabel="Remover"
          isPending={isDeletePending}
        />
      </div>
    </AppLayout>
  )
}
