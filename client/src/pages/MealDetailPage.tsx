import { useParams, useSearchParams } from 'react-router-dom'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import MealDetailSkeleton from '@/modules/meal/skeletons/MealDetailSkeleton'
import MealTotalsCard from '@/modules/meal/components/MealTotalsCard'
import MealItemRow from '@/modules/meal/components/MealItemRow'
import MealRecipeRow from '@/modules/meal/components/MealRecipeRow'
import MealEmptyState from '@/modules/meal/components/MealEmptyState'
import { getMealConfig } from '@/modules/meal/config/mealConfig'
import { useMealDetailPage } from '@/modules/meal/hooks/useMealDetailPage'

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId') ?? undefined
  const { resolvedTheme } = useThemeContext()

  const {
    meal, isLoading, isError, confirm, setConfirm, handleConfirm, isDeletePending,
    deleteMutation, removeItem, removeRecipe, backPath, selectFoodPath, navigate,
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
  const displayTime = meal.time
    ?? new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const hasItems = meal.items.length > 0
  const hasRecipes = meal.recipes.length > 0
  const isEmpty = !hasItems && !hasRecipes

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
          <p className="text-sm font-bold mt-1" style={{ color: cfg.theme }}>
            {displayTime}
          </p>
        </div>

        <MealTotalsCard totals={meal.totals} cfg={cfg} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
            Alimentos ({meal.items.length})
          </h2>
        </div>

        {!hasItems ? (
          <MealEmptyState
            title="Nenhum alimento"
            description="Adicione alimentos para compor esta refeição"
            onAddClick={() => navigate(selectFoodPath)}
          />
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {meal.items.map((item) => (
              <MealItemRow
                key={item.id}
                item={item}
                cfg={cfg}
                isRemovePending={removeItem.isPending}
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
        )}

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

        <div className="flex gap-3 mt-6">
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
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
          title={
            confirm?.type === 'meal'
              ? `Remover refeição "${confirm.name}"?`
              : confirm?.type === 'mealItem'
                ? `Remover "${confirm.name}"?`
                : confirm?.type === 'mealRecipe'
                  ? `Remover receita "${confirm.name}"?`
                  : 'Tem certeza?'
          }
          description={
            confirm?.type === 'meal'
              ? 'A refeição será excluída permanentemente.'
              : confirm?.type === 'mealItem'
                ? 'O alimento será removido desta refeição.'
                : confirm?.type === 'mealRecipe'
                  ? 'A receita será removida desta refeição.'
                  : 'Esta ação não pode ser desfeita.'
          }
          confirmLabel="Remover"
          isPending={isDeletePending}
        />
      </div>
    </AppLayout>
  )
}
