import { useParams, useSearchParams } from 'react-router-dom'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import { ArrowLeft, ChefHat, Clock, Plus, Save, StickyNote, Trash2, Utensils } from 'lucide-react'
import AppLayout from '@/shared/layouts/AppLayout'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import Spinner from '@/shared/components/Spinner'
import MealDetailSkeleton from '@/modules/meal/skeletons/MealDetailSkeleton'
import MealTotalsCard from '@/modules/meal/components/MealTotalsCard'
import MealItemRow from '@/modules/meal/components/MealItemRow'
import MealRecipeRow from '@/modules/meal/components/MealRecipeRow'
import MealEmptyState from '@/modules/meal/components/MealEmptyState'
import { getMealAccent, getMealType as getMealConfig } from '@/shared/config/mealTypes'
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
    deleteMutation, removeItem, updateItem, removeRecipe,
    observationsForm, handleUpdateObservations, updateObservations,
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
        <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto text-center">
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

  const cfg = getMealConfig(meal.mealType)
  const MealIcon = cfg.icon
  const accent = getMealAccent(cfg, resolvedTheme === 'dark')

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-bold text-neutral-500 transition-colors duration-200 hover:text-red-600 dark:text-neutral-400"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: accent.surface }}
            >
              <MealIcon size={22} style={{ color: accent.ink }} />
            </span>
            <h1 className="min-w-0 flex-1 truncate font-display text-3xl font-extrabold leading-none tracking-tight text-neutral-950 dark:text-neutral-100 sm:text-4xl">
              {meal.name}
            </h1>
            {displayTime && (
              <span
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                style={{ backgroundColor: accent.surface }}
              >
                <Clock size={16} style={{ color: accent.strong }} />
                <span
                  className="text-sm font-extrabold leading-none tabular-nums"
                  style={{ color: accent.ink }}
                >
                  {displayTime}
                </span>
              </span>
            )}
          </div>
        </div>

        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: accent.surface }}
            >
              <StickyNote size={18} style={{ color: accent.ink }} />
            </span>
            <span className="text-base font-bold tracking-tight" style={{ color: accent.ink }}>
              Observações
            </span>
          </div>

          <form onSubmit={handleUpdateObservations}>
            <textarea
              {...observationsForm.register('observations')}
              rows={3}
              placeholder="Ex: sem glúten, sem lactose..."
              className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500"
            />
            {observationsForm.formState.errors.observations && (
              <p className="mt-1.5 text-xs text-red-500">
                {observationsForm.formState.errors.observations.message}
              </p>
            )}
            <button
              type="submit"
              disabled={updateObservations.isPending || !observationsForm.formState.isDirty}
              className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-bold text-neutral-700 transition-colors duration-200 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              {updateObservations.isPending ? <Spinner size={16} /> : <Save size={18} />}
              {updateObservations.isPending ? 'Salvando…' : 'Salvar observações'}
            </button>
          </form>
        </section>

        <MealTotalsCard totals={meal.totals} cfg={cfg} />

        <div className="mb-4 flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: accent.surface }}
          >
            <Utensils size={18} style={{ color: accent.ink }} />
          </span>
          <span className="text-base font-bold tracking-tight" style={{ color: accent.ink }}>
            Alimentos
          </span>
          <span className="text-sm font-bold tabular-nums text-neutral-400 dark:text-neutral-500">
            {meal.items.length}
          </span>
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
            <div className="mb-4 flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: accent.surface }}
              >
                <ChefHat size={18} style={{ color: accent.ink }} />
              </span>
              <span className="text-base font-bold tracking-tight" style={{ color: accent.ink }}>
                Receitas
              </span>
              <span className="text-sm font-bold tabular-nums text-neutral-400 dark:text-neutral-500">
                {meal.recipes.length}
              </span>
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(selectFoodPath)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: cfg.accent }}
          >
            <Plus size={18} />
            Adicionar item
          </button>

          <button
            type="button"
            onClick={() => setConfirm({ type: 'meal', id: meal.id, name: meal.name })}
            disabled={deleteMutation.isPending}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-100 py-3 text-sm font-bold text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            {deleteMutation.isPending ? <Spinner size={16} /> : <Trash2 size={18} />}
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
      </div>
    </AppLayout>
  )
}
