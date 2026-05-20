import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash,
  Fire,
  CookingPot,
  X,
  PencilSimple,
  Check,
} from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import { useGetRecipe } from '@/modules/recipe/hooks/useGetRecipe'
import { useDeleteRecipe } from '@/modules/recipe/hooks/useDeleteRecipe'
import { useRemoveRecipeItem } from '@/modules/recipe/hooks/useRemoveRecipeItem'
import { useUpdateRecipe } from '@/modules/recipe/hooks/useUpdateRecipe'
import RecipeDetailSkeleton from '@/modules/recipe/skeletons/RecipeDetailSkeleton'

type ConfirmState =
  | { type: 'recipe'; id: string; name: string }
  | { type: 'recipeItem'; recipeId: string; itemId: string; name: string }
  | null

const totalsConfig = [
  { label: 'Calorias', valueKey: 'calories' as const, unit: 'kcal', color: 'bg-red-500', track: 'bg-red-50' },
  { label: 'Proteína', valueKey: 'protein' as const, unit: 'g', color: 'bg-amber-500', track: 'bg-amber-50' },
  { label: 'Carboidrato', valueKey: 'carbs' as const, unit: 'g', color: 'bg-blue-500', track: 'bg-blue-50' },
  { label: 'Gordura', valueKey: 'fat' as const, unit: 'g', color: 'bg-violet-500', track: 'bg-violet-50' },
]

export default function RecipeDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  const { data: recipe, isPending, isError } = useGetRecipe(id ?? '')
  const deleteMutation = useDeleteRecipe()
  const removeItem = useRemoveRecipeItem()
  const updateMutation = useUpdateRecipe()

  const handleConfirm = () => {
    if (!confirm) return
    if (confirm.type === 'recipe') {
      deleteMutation.mutate(confirm.id, {
        onSuccess: () => {
          setConfirm(null)
          navigate('/app/foods')
        },
      })
    } else if (confirm.type === 'recipeItem') {
      removeItem.mutate(
        { recipeId: confirm.recipeId, itemId: confirm.itemId },
        {
          onSuccess: () => setConfirm(null),
        },
      )
    }
  }

  const isDeletePending =
    confirm?.type === 'recipe'
      ? deleteMutation.isPending
      : confirm?.type === 'recipeItem'
        ? removeItem.isPending
        : false

  if (isPending) {
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
          <p className="text-xs text-neutral-400 mb-6">Verifique sua conexão e tente novamente.</p>
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

  const handleSaveName = () => {
    if (!editName.trim() || editName === recipe.name) {
      setIsEditingName(false)
      return
    }
    updateMutation.mutate(
      { id: recipe.id, name: editName.trim() },
      { onSuccess: () => setIsEditingName(false) },
    )
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/app/foods')}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 hover:text-red-600 transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-50">
              <CookingPot size={22} weight="bold" className="text-rose-600" />
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                    if (e.key === 'Escape') setIsEditingName(false)
                  }}
                  autoFocus
                  disabled={updateMutation.isPending}
                  className="flex-1 text-2xl sm:text-3xl font-extrabold text-neutral-950 bg-transparent outline-none border-b-2 border-rose-400 pb-1 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={updateMutation.isPending}
                  className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <span className="inline-block w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                  ) : (
                    <Check size={16} weight="bold" className="text-rose-600" />
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight leading-none truncate">
                  {recipe.name}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setEditName(recipe.name)
                    setIsEditingName(true)
                  }}
                  className="w-8 h-8 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <PencilSimple size={14} weight="bold" className="text-neutral-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Fire size={18} weight="fill" className="text-rose-500" />
            <h2 className="text-sm font-black uppercase tracking-widest text-rose-600">
              Totais da receita
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {totalsConfig.map((t) => (
              <div key={t.label} className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                  {t.label}
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 tabular-nums leading-none">
                    {Math.round(recipe.totals[t.valueKey])}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-400 uppercase">{t.unit}</span>
                </div>
                <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden ${t.track}`}>
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest">
            Alimentos ({recipe.items.length})
          </h2>
        </div>

        {recipe.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <p className="text-sm font-semibold text-neutral-400 mb-1">Nenhum alimento</p>
            <p className="text-xs text-neutral-300 mb-4">Adicione alimentos para compor esta receita</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipe.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 hover:border-neutral-300 transition-colors duration-150"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-neutral-950 truncate">
                      {(item.food ?? item.privateFood)?.name ?? 'Alimento'}
                    </p>
                    <p className="text-xs font-bold text-neutral-400 mt-0.5">
                      {Math.round(item.quantity)}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none text-rose-600">
                        {Math.round(item.calories)}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">
                        kcal
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({
                          type: 'recipeItem',
                          recipeId: recipe.id,
                          itemId: item.id,
                          name: (item.food ?? item.privateFood)?.name ?? 'Alimento',
                        })
                      }
                      disabled={removeItem.isPending}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed bg-rose-50 text-rose-600 hover:bg-rose-100"
                      aria-label={`Remover ${(item.food ?? item.privateFood)?.name ?? 'Alimento'}`}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-[11px] font-extrabold text-amber-900 tabular-nums">
                      {Math.round(item.protein)}<span className="text-amber-700 font-bold">g</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 ml-auto">
                      Prot
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-[11px] font-extrabold text-blue-900 tabular-nums">
                      {Math.round(item.carbs)}<span className="text-blue-700 font-bold">g</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-800 ml-auto">
                      Carb
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-lg px-2 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                    <span className="text-[11px] font-extrabold text-violet-900 tabular-nums">
                      {Math.round(item.fat)}<span className="text-violet-700 font-bold">g</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-800 ml-auto">
                      Gord
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
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
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
