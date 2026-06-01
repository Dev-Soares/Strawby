import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Plus,
  Trash,
  Fire,
  CoffeeIcon,
  ForkKnifeIcon,
  LeafIcon,
  MoonIcon,
  CookieIcon,
  X,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import { useGetMeal } from '@/modules/meal/hooks/useGetMeal'
import { useDeleteMeal } from '@/modules/meal/hooks/useDeleteMeal'
import { useRemoveMealItem } from '@/modules/meal/hooks/useRemoveMealItem'
import { useRemoveMealRecipe } from '@/modules/meal/hooks/useRemoveMealRecipe'
import MealDetailSkeleton from '@/modules/meal/skeletons/MealDetailSkeleton'

type ConfirmState =
  | { type: 'meal'; id: string; name: string }
  | { type: 'mealItem'; mealId: string; itemId: string; name: string }
  | { type: 'mealRecipe'; mealId: string; recipeId: string; name: string }
  | null

const mealConfig: Record<string, {
  icon: Icon
  label: string
  accent: string
  bg: string
  text: string
  divider: string
  theme: string
  themeLight: string
  themeBg: string
}> = {
  breakfast: {
    icon: CoffeeIcon, label: 'Café da manhã',
    accent: 'text-orange-600', bg: 'bg-orange-50', text: 'text-orange-700', divider: 'border-orange-100',
    theme: '#ea580c', themeLight: '#fed7aa', themeBg: '#fff7ed',
  },
  lunch: {
    icon: ForkKnifeIcon, label: 'Almoço',
    accent: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', divider: 'border-emerald-100',
    theme: '#16a34a', themeLight: '#bbf7d0', themeBg: '#f0fdf4',
  },
  snack: {
    icon: LeafIcon, label: 'Lanche',
    accent: 'text-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', divider: 'border-blue-100',
    theme: '#2563eb', themeLight: '#bfdbfe', themeBg: '#eff6ff',
  },
  dinner: {
    icon: MoonIcon, label: 'Jantar',
    accent: 'text-violet-600', bg: 'bg-violet-50', text: 'text-violet-700', divider: 'border-violet-100',
    theme: '#9333ea', themeLight: '#e9d5ff', themeBg: '#faf5ff',
  },
  supper: {
    icon: CookieIcon, label: 'Ceia',
    accent: 'text-slate-600', bg: 'bg-slate-100', text: 'text-slate-700', divider: 'border-slate-100',
    theme: '#475569', themeLight: '#cbd5e1', themeBg: '#f8fafc',
  },
}

const fallbackConfig = {
  icon: CoffeeIcon, label: 'Refeição',
  accent: 'text-neutral-600', bg: 'bg-neutral-50', text: 'text-neutral-700', divider: 'border-neutral-100',
  theme: '#475569', themeLight: '#e2e8f0', themeBg: '#f8fafc',
}

export default function MealDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId') ?? undefined
  const queryClient = useQueryClient()

  const { data: meal, isLoading, isError } = useGetMeal(id ?? '', patientId)
  const deleteMutation = useDeleteMeal(patientId)
  const removeItem = useRemoveMealItem(patientId)
  const removeRecipe = useRemoveMealRecipe(patientId)
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  const handleConfirm = () => {
    if (!confirm) return
    if (confirm.type === 'meal') {
      deleteMutation.mutate(confirm.id, {
        onSuccess: () => {
          setConfirm(null)
          navigate(backPath)
        },
      })
    } else if (confirm.type === 'mealItem') {
      removeItem.mutate(
        { mealId: confirm.mealId, itemId: confirm.itemId },
        {
          onSuccess: () => {
            setConfirm(null)
            queryClient.invalidateQueries({ queryKey: ['meal', confirm.mealId] })
          },
        },
      )
    } else if (confirm.type === 'mealRecipe') {
      removeRecipe.mutate(
        { mealId: confirm.mealId, recipeId: confirm.recipeId },
        {
          onSuccess: () => setConfirm(null),
        },
      )
    }
  }

  const isDeletePending =
    confirm?.type === 'meal'
      ? deleteMutation.isPending
      : confirm?.type === 'mealItem'
        ? removeItem.isPending
        : confirm?.type === 'mealRecipe'
          ? removeRecipe.isPending
          : false

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

  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const cfg = mealConfig[meal.mealType ?? ''] || fallbackConfig
  const MealIcon = cfg.icon

  const displayTime = meal.time
    ?? new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const isPlan = meal.kind === 'PLAN'
  const backPath = patientId
    ? `/app/nutritionist/patient/${patientId}`
    : isPlan ? '/app/plan' : '/app/home'

  const totals = [
    { label: 'Calorias', value: Math.round(meal.totals.calories), unit: 'kcal', color: 'bg-red-500', track: 'bg-red-50 dark:bg-red-950/40' },
    { label: 'Proteína', value: Math.round(meal.totals.protein), unit: 'g', color: 'bg-amber-500', track: 'bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Carboidrato', value: Math.round(meal.totals.carbs), unit: 'g', color: 'bg-blue-500', track: 'bg-blue-50 dark:bg-blue-950/40' },
    { label: 'Gordura', value: Math.round(meal.totals.fat), unit: 'g', color: 'bg-violet-500', track: 'bg-violet-50 dark:bg-violet-950/40' },
  ]

  const hasItems = meal.items.length > 0
  const hasRecipes = meal.recipes.length > 0
  const isEmpty = !hasItems && !hasRecipes

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
        {/* Header */}
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

        {/* Totals */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 sm:p-6 mb-6 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-5">
            <Fire size={18} weight="fill" style={{ color: cfg.theme }} />
            <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: cfg.theme }}>
              Totais da refeição
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {totals.map((t) => (
              <div key={t.label} className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                  {t.label}
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums leading-none">
                    {t.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase">{t.unit}</span>
                </div>
                <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden ${t.track} transition-colors duration-300`}>
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
            Alimentos ({meal.items.length})
          </h2>
        </div>

        {meal.items.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center mb-6 transition-colors duration-300">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <ForkKnifeIcon size={20} weight="duotone" className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-1">Nenhum alimento</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4">Adicione alimentos para compor esta refeição</p>
            <button
              type="button"
              onClick={() => navigate(`/app/foods/select?mealId=${meal.id}&type=${isPlan ? 'plan-meal' : 'meal'}${patientId ? `&patientId=${patientId}` : ''}`)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
            >
              <Plus size={13} weight="bold" />
              Adicionar agora
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {meal.items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-neutral-950 dark:text-neutral-100 truncate">
                      {(item.food ?? item.privateFood)?.name ?? 'Alimento'}
                    </p>
                    <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {Math.round(item.quantity)}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none" style={{ color: cfg.theme }}>
                        {Math.round(item.calories)}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mt-0.5">
                        kcal
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({
                          type: 'mealItem',
                          mealId: meal.id,
                          itemId: item.id,
                          name: (item.food ?? item.privateFood)?.name ?? 'Alimento',
                        })
                      }
                      disabled={removeItem.isPending}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: cfg.theme, color: '#ffffff' }}
                      aria-label={`Remover ${(item.food ?? item.privateFood)?.name ?? 'Alimento'}`}
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 tabular-nums">
                      {Math.round(item.protein)}<span className="text-amber-700 dark:text-amber-300 font-bold">g</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 ml-auto">
                      Prot
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-200 tabular-nums">
                      {Math.round(item.carbs)}<span className="text-blue-700 dark:text-blue-300 font-bold">g</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 ml-auto">
                      Carb
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                    <span className="text-[11px] font-extrabold text-violet-900 dark:text-violet-200 tabular-nums">
                      {Math.round(item.fat)}<span className="text-violet-700 dark:text-violet-300 font-bold">g</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-800 dark:text-violet-300 ml-auto">
                      Gord
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipes list */}
        {hasRecipes && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
                Receitas ({meal.recipes.length})
              </h2>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {meal.recipes.map((recipe) => (
                <div
                  key={recipe.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-bold text-neutral-950 dark:text-neutral-100 truncate">
                        {recipe.name}
                      </p>
                      <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mt-0.5">
                        Receita
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none" style={{ color: cfg.theme }}>
                          {Math.round(recipe.calories)}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mt-0.5">
                          kcal
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirm({
                            type: 'mealRecipe',
                            mealId: meal.id,
                            recipeId: recipe.id,
                            name: recipe.name,
                          })
                        }
                        disabled={removeRecipe.isPending}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: cfg.theme, color: '#ffffff' }}
                        aria-label={`Remover ${recipe.name}`}
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 tabular-nums">
                        {Math.round(recipe.protein)}<span className="text-amber-700 dark:text-amber-300 font-bold">g</span>
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 ml-auto">
                        Prot
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-200 tabular-nums">
                        {Math.round(recipe.carbs)}<span className="text-blue-700 dark:text-blue-300 font-bold">g</span>
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 ml-auto">
                        Carb
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                      <span className="text-[11px] font-extrabold text-violet-900 dark:text-violet-200 tabular-nums">
                        {Math.round(recipe.fat)}<span className="text-violet-700 dark:text-violet-300 font-bold">g</span>
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-800 dark:text-violet-300 ml-auto">
                        Gord
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isEmpty && (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center mb-6 transition-colors duration-300">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <ForkKnifeIcon size={20} weight="duotone" className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-1">Refeição vazia</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4">Adicione alimentos ou receitas para compor esta refeição</p>
            <button
              type="button"
              onClick={() => navigate(`/app/foods/select?mealId=${meal.id}&type=${isPlan ? 'plan-meal' : 'meal'}${patientId ? `&patientId=${patientId}` : ''}`)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
            >
              <Plus size={13} weight="bold" />
              Adicionar agora
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(`/app/foods/select?mealId=${meal.id}&type=${isPlan ? 'plan-meal' : 'meal'}${patientId ? `&patientId=${patientId}` : ''}`)}
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
