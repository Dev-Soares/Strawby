import { useNavigate, useParams } from 'react-router-dom'
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
import { useGetMeal } from '@/modules/meal/hooks/useGetMeal'
import { useDeleteMeal } from '@/modules/meal/hooks/useDeleteMeal'
import { useRemoveMealItem } from '@/modules/meal/hooks/useRemoveMealItem'
import MealDetailSkeleton from '@/modules/meal/skeletons/MealDetailSkeleton'

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
  const queryClient = useQueryClient()

  const { data: meal, isPending, isError } = useGetMeal(id ?? '')
  const deleteMutation = useDeleteMeal()
  const removeItem = useRemoveMealItem()

  if (isPending) {
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
          <p className="text-xs text-neutral-400 mb-6">Verifique sua conexão e tente novamente.</p>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="py-3 px-6 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 cursor-pointer"
          >
            Voltar para início
          </button>
        </div>
      </AppLayout>
    )
  }

  const cfg = mealConfig[meal.mealType ?? ''] || fallbackConfig
  const MealIcon = cfg.icon

  const displayTime = meal.time
    ?? new Date(meal.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const isPlan = meal.kind === 'PLAN'
  const backPath = isPlan ? '/plan' : '/home'

  const totals = [
    { label: 'Calorias', value: Math.round(meal.totals.calories), unit: 'kcal', color: 'bg-red-500', track: 'bg-red-50' },
    { label: 'Proteína', value: Math.round(meal.totals.protein), unit: 'g', color: 'bg-amber-500', track: 'bg-amber-50' },
    { label: 'Carboidrato', value: Math.round(meal.totals.carbs), unit: 'g', color: 'bg-blue-500', track: 'bg-blue-50' },
    { label: 'Gordura', value: Math.round(meal.totals.fat), unit: 'g', color: 'bg-violet-500', track: 'bg-violet-50' },
  ]

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <ArrowLeft size={18} weight="bold" className="text-red-600" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-0.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: cfg.themeLight }}
              >
                <MealIcon size={22} weight="bold" style={{ color: cfg.theme }} />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight leading-none truncate">
                {meal.name}
              </h1>
            </div>
            <p className="text-sm font-bold mt-1" style={{ color: cfg.theme }}>
              {cfg.label} · {displayTime}
            </p>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Fire size={18} weight="fill" style={{ color: cfg.theme }} />
            <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: cfg.theme }}>
              Totais da refeição
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {totals.map((t) => (
              <div key={t.label} className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-black text-neutral-400 uppercase tracking-widest mb-1.5">
                  {t.label}
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 tabular-nums leading-none">
                    {t.value}
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
            Alimentos ({meal.items.length})
          </h2>
        </div>

        {meal.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <p className="text-sm font-semibold text-neutral-400 mb-1">Nenhum alimento</p>
            <p className="text-xs text-neutral-300 mb-4">Adicione alimentos para compor esta refeição</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {meal.items.map((item) => (
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
                      <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none" style={{ color: cfg.theme }}>
                        {Math.round(item.calories)}
                      </p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">
                        kcal
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem.mutate(
                          { mealId: meal.id, itemId: item.id },
                          {
                            onSuccess: () => {
                              queryClient.invalidateQueries({ queryKey: ['meal', meal.id] })
                            },
                          },
                        )
                      }
                      disabled={removeItem.isPending}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: cfg.themeLight, color: cfg.theme }}
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
            onClick={() => navigate(`/foods/select?mealId=${meal.id}&type=${isPlan ? 'plan-meal' : 'meal'}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md transition-colors duration-150 cursor-pointer hover:brightness-110"
            style={{ backgroundColor: cfg.theme }}
          >
            <Plus size={16} weight="bold" />
            Adicionar alimento
          </button>

          <button
            type="button"
            onClick={() =>
              deleteMutation.mutate(meal.id, {
                onSuccess: () => navigate(backPath),
              })
            }
            disabled={deleteMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash size={16} weight="bold" />
            )}
            {deleteMutation.isPending ? 'Removendo…' : 'Remover refeição'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
