import { useParams, useSearchParams } from 'react-router-dom'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import { ArrowLeft, Plus, Trash, PencilSimple, FloppyDisk } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import Spinner from '@/shared/components/Spinner'
import MealDetailSkeleton from '@/modules/meal/skeletons/MealDetailSkeleton'
import MealTotalsCard from '@/modules/meal/components/MealTotalsCard'
import MealItemRow from '@/modules/meal/components/MealItemRow'
import MealRecipeRow from '@/modules/meal/components/MealRecipeRow'
import MealEmptyState from '@/modules/meal/components/MealEmptyState'
import EditMealTimeModal from '@/modules/meal/components/EditMealTimeModal'
import { getMealType as getMealConfig } from '@/shared/config/mealTypes'
import { useMealDetailPage } from '@/modules/meal/hooks/useMealDetailPage'
import { confirmDeleteText } from '@/shared/utils/confirmDeleteText'

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId') ?? undefined
  const { resolvedTheme } = useThemeContext()

  const {
    meal, displayTime, hasItems, hasRecipes, isEmpty,
    isLoading, isError, confirm, setConfirm, handleConfirm, isDeletePending,
    deleteMutation, removeItem, updateItem, updateMeal, removeRecipe,
    editTimeOpen, setEditTimeOpen, handleUpdateTime,
    observationsForm, handleUpdateObservations, updateObservations, isPlan,
    backPath, selectFoodPath, navigate,
  } = useMealDetailPage({ mealId: id ?? '', patientId })

  if (isLoading) {
    return (
      <AppLayout>
        <MealDetailSkeleton />
      </AppLayout>
    )
  }

  if (isError || !meal) {
    return (
      <AppLayout>
        <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-red-500 mb-1">Erro ao carregar refeição</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-6">Verifique sua conexão e tente novamente.</p>
          <button
            type="button"
            onClick={() => navigate('/app/home')}
            className="py-3 px-6 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 cursor-pointer"
          >
            Voltar para início
          </button>
        </div>
      </AppLayout>
    )
  }

  const isDark = resolvedTheme === 'dark'
  const cfg = getMealConfig(meal.mealType)
  const MealIcon = cfg.icon

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            Voltar
          </button>
          <div className="flex items-center gap-3 mb-0.5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDark ? `${cfg.theme}26` : cfg.themeLight }}
            >
              <MealIcon size={22} weight="bold" style={{ color: cfg.theme }} />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none truncate">
              {meal.name}
            </h1>
          </div>
          {displayTime && (
            <p className="text-sm font-bold mt-1" style={{ color: cfg.theme }}>
              {displayTime}
            </p>
          )}
          <form onSubmit={handleUpdateObservations} className="mt-4">
            <label className="block text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">
              Observações
            </label>
            <textarea
              {...observationsForm.register('observations')}
              rows={3}
              placeholder="Ex: sem glúten, sem lactose..."
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all duration-200"
            />
            {observationsForm.formState.errors.observations && (
              <p className="text-xs text-red-500 mt-1.5">
                {observationsForm.formState.errors.observations.message}
              </p>
            )}
            <button
              type="submit"
              disabled={updateObservations.isPending || !observationsForm.formState.isDirty}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            >
              {updateObservations.isPending ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FloppyDisk size={13} weight="bold" />
              )}
              {updateObservations.isPending ? 'Salvando…' : 'Salvar observações'}
            </button>
          </form>
        </div>

        <MealTotalsCard totals={meal.totals} cfg={cfg} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
            Alimentos ({meal.items.length})
          </h2>
        </div>

        {!hasItems && hasRecipes ? (
          <MealEmptyState
            title="Nenhum alimento"
            description="Adicione alimentos para compor esta refeição"
            onAddClick={() => navigate(selectFoodPath)}
          />
        ) : hasItems ? (
          <div className="flex flex-col gap-3 mb-6">
            {meal.items.map((item) => (
              <MealItemRow
                key={item.id}
                item={item}
                cfg={cfg}
                isRemovePending={removeItem.isPending}
                isUpdatePending={updateItem.isPending}
                onUpdateQuantity={(it, quantity) =>
                  updateItem.mutate({ mealId: meal.id, itemId: it.id, quantity })
                }
                onRemove={(it) =>
                  setConfirm({
                    type: 'mealItem',
                    mealId: meal.id,
                    itemId: it.id,
                    name: (it.food ?? it.privateFood)?.name ?? 'Alimento',
                  })
                }
              />
            ))}
          </div>
        ) : null}

        {hasRecipes && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
                Receitas ({meal.recipes.length})
              </h2>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {meal.recipes.map((recipe) => (
                <MealRecipeRow
                  key={recipe.id}
                  recipe={recipe}
                  cfg={cfg}
                  isRemovePending={removeRecipe.isPending}
                  onRemove={(r) =>
                    setConfirm({
                      type: 'mealRecipe',
                      mealId: meal.id,
                      recipeId: r.id,
                      name: r.name,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}

        {isEmpty && (
          <MealEmptyState
            title="Refeição vazia"
            description="Adicione alimentos ou receitas para compor esta refeição"
            onAddClick={() => navigate(selectFoodPath)}
          />
        )}

        {!isPlan && (
          <button
            type="button"
            onClick={() => setEditTimeOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer mt-6"
          >
            <PencilSimple size={16} weight="bold" />
            Editar refeição
          </button>
        )}

        <div className="flex gap-3 mt-3">
          <button
            type="button"
            onClick={() => navigate(selectFoodPath)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md transition-colors duration-300 cursor-pointer hover:brightness-110"
            style={{ backgroundColor: cfg.theme }}
          >
            <Plus size={16} weight="bold" />
            Adicionar item
          </button>

          <button
            type="button"
            onClick={() => setConfirm({ type: 'meal', id: meal.id, name: meal.name })}
            disabled={deleteMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? (
              <Spinner size={16} className="border-white/40 border-t-white" />
            ) : (
              <Trash size={16} weight="bold" />
            )}
            {deleteMutation.isPending ? 'Removendo…' : 'Remover refeição'}
          </button>
        </div>

        <ConfirmDeleteModal
          isOpen={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={handleConfirm}
          title={confirmDeleteText(confirm).title}
          description={confirmDeleteText(confirm).description}
          confirmLabel="Remover"
          isPending={isDeletePending}
        />

        <EditMealTimeModal
          isOpen={editTimeOpen}
          currentMealType={meal.mealType}
          currentTime={meal.time ?? displayTime}
          currentObservations={meal.observations}
          isPending={updateMeal.isPending}
          onClose={() => setEditTimeOpen(false)}
          onSave={handleUpdateTime}
        />
      </div>
    </AppLayout>
  )
}
