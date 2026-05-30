import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Fire, CookingPot } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import FoodSearch from '../modules/food/components/FoodSearch'
import FoodSkeleton from '../modules/food/skeletons/FoodSkeleton'
import PrivateFoodSkeleton from '../modules/private-food/skeletons/PrivateFoodSkeleton'
import { useSearchFood } from '../modules/food/hooks/useSearchFood'
import { useGetPrivateFoods } from '../modules/private-food/hooks/useGetPrivateFoods'
import { useGetRecipes } from '../modules/recipe/hooks/useGetRecipes'
import { useAddMealItem } from '../modules/meal/hooks/useAddMealItem'
import { useAddMealPrivateFoodItem } from '../modules/meal/hooks/useAddMealPrivateFoodItem'
import { useAddMealRecipe } from '../modules/meal/hooks/useAddMealRecipe'
import { useAddRecipeItem } from '../modules/recipe/hooks/useAddRecipeItem'
import { useAddRecipePrivateFoodItem } from '../modules/recipe/hooks/useAddRecipePrivateFoodItem'
import RecipeCardSkeleton from '../modules/recipe/skeletons/RecipeCardSkeleton'

type Tab = 'public' | 'private' | 'recipes'

type SelectableFood = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  kind: 'public' | 'private'
  servingSize: string | null
}

type SelectableRecipe = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  kind: 'recipe'
}

type SelectableItem = SelectableFood | SelectableRecipe

const macros = [
  { key: 'protein' as const, label: 'Prot', colorClass: 'text-amber-500' },
  { key: 'carbs' as const, label: 'Carb', colorClass: 'text-blue-500' },
  { key: 'fat' as const, label: 'Gord', colorClass: 'text-violet-500' },
]

function SelectableFoodCard({ item, onSelect }: { item: SelectableItem; onSelect: (item: SelectableItem) => void }) {
  const isRecipe = item.kind === 'recipe'

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 relative">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 flex items-center justify-center transition-colors duration-150 cursor-pointer z-10"
        aria-label={`Adicionar ${item.name}`}
      >
        <Plus size={16} weight="bold" />
      </button>

      <div className="mb-3 pr-10">
        <p className="text-base font-bold text-neutral-950 dark:text-neutral-100 leading-snug mb-0.5 transition-colors duration-300">
          {item.name}
        </p>
        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
          {isRecipe ? 'Receita' : item.kind === 'private' && item.servingSize ? `por ${item.servingSize}g` : 'por 100g'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
        <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-200 tabular-nums leading-none transition-colors duration-300">
          {Math.round(item.calories)}
        </span>
        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 pb-0.5 transition-colors duration-300">kcal</span>
      </div>

      <div className="flex gap-4">
        {macros.map(({ key, label, colorClass }) => (
          <div key={key} className="flex-1 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">{label}</span>
            <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
              {item[key]}g
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SelectFoodPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const mealId = searchParams.get('mealId')
  const recipeId = searchParams.get('recipeId')
  const type = searchParams.get('type') ?? 'meal'

  const isRecipe = !!recipeId
  const targetId = mealId ?? recipeId ?? ''
  const isPlan = type === 'plan-meal'

  const addMealItem = useAddMealItem()
  const addMealPrivateFoodItem = useAddMealPrivateFoodItem()
  const addMealRecipe = useAddMealRecipe()
  const addRecipeItem = useAddRecipeItem()
  const addRecipePrivateFoodItem = useAddRecipePrivateFoodItem()

  const [tab, setTab] = useState<Tab>('public')
  const [search, setSearch] = useState('')
  const [step, setStep] = useState<'search' | 'quantity'>('search')
  const [selectedFood, setSelectedFood] = useState<SelectableFood | null>(null)
  const [quantity, setQuantity] = useState('100')

  const {
    data: publicFoods,
    isPending: isPublicPending,
    isError: isPublicError,
  } = useSearchFood(tab === 'public' ? search : '')

  const {
    data: private-foods,
    isPending: isPrivatePending,
    isError: isPrivateError,
  } = useGetPrivateFoods()

  const {
    data: recipes,
    isPending: isRecipesPending,
    isError: isRecipesError,
  } = useGetRecipes()

  const filteredPrivateFoods = useMemo(() => {
    if (!private-foods) return []
    return private-foods
  }, [private-foods])

  const filteredRecipes = useMemo(() => {
    if (!recipes) return []
    return recipes
  }, [recipes])

  const foods: SelectableFood[] = useMemo(() => {
    if (tab === 'public') {
      return (publicFoods ?? []).map((f) => ({ ...f, kind: 'public' as const, servingSize: null }))
    }
    return filteredPrivateFoods.map((f) => ({ ...f, kind: 'private' as const, servingSize: f.servingSize }))
  }, [tab, publicFoods, filteredPrivateFoods])

  const isPending = tab === 'public' ? isPublicPending : tab === 'private' ? isPrivatePending : isRecipesPending
  const isError = tab === 'public' ? isPublicError : tab === 'private' ? isPrivateError : isRecipesError

  const anyPending = addMealItem.isPending || addMealPrivateFoodItem.isPending || addMealRecipe.isPending || addRecipeItem.isPending || addRecipePrivateFoodItem.isPending

  const handleSelectItem = (item: SelectableItem) => {
    if (item.kind === 'recipe') {
      if (!mealId) return
      addMealRecipe.mutate(
        { mealId, dto: { recipeId: item.id } },
        {
          onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ['meal', mealId], type: 'all' })
            navigate(`/app/meals/${mealId}`)
          },
        },
      )
      return
    }

    setSelectedFood(item)
    const defaultQuantity = item.kind === 'private' && item.servingSize ? item.servingSize : '100'
    setQuantity(defaultQuantity)
    setStep('quantity')
  }

  const handleConfirm = () => {
    if (!selectedFood || !targetId) {
      console.error('[SelectFoodPage] missing targetId or selectedFood', { targetId, selectedFood })
      return
    }

    const q = Number(quantity)

    if (isRecipe) {
      if (selectedFood.kind === 'public') {
        addRecipeItem.mutate(
          { recipeId: targetId, dto: { foodId: selectedFood.id, quantity: q } },
          {
            onSuccess: async () => {
              await queryClient.refetchQueries({ queryKey: ['recipe', targetId], type: 'all' })
              navigate(`/app/recipes/${targetId}`)
            },
          },
        )
      } else {
        addRecipePrivateFoodItem.mutate(
          { recipeId: targetId, dto: { private-foodId: selectedFood.id, quantity: q } },
          {
            onSuccess: async () => {
              await queryClient.refetchQueries({ queryKey: ['recipe', targetId], type: 'all' })
              navigate(`/app/recipes/${targetId}`)
            },
          },
        )
      }
    } else {
      if (selectedFood.kind === 'public') {
        addMealItem.mutate(
          { mealId: targetId, dto: { foodId: selectedFood.id, quantity: q } },
          {
            onSuccess: async () => {
              await queryClient.refetchQueries({ queryKey: ['meal', targetId], type: 'all' })
              navigate(`/app/meals/${targetId}`)
            },
          },
        )
      } else {
        addMealPrivateFoodItem.mutate(
          { mealId: targetId, dto: { private-foodId: selectedFood.id, quantity: q } },
          {
            onSuccess: async () => {
              await queryClient.refetchQueries({ queryKey: ['meal', targetId], type: 'all' })
              navigate(`/app/meals/${targetId}`)
            },
          },
        )
      }
    }
  }

  const handleBack = () => {
    if (step === 'quantity') {
      setStep('search')
      setSelectedFood(null)
    } else {
      navigate(-1)
    }
  }

  const tabs: { key: Tab; label: string; icon?: typeof CookingPot }[] = [
    { key: 'public', label: 'Todos' },
    { key: 'private', label: 'Meus alimentos' },
  ]

  if (!isRecipe) {
    tabs.push({ key: 'recipes', label: 'Receitas', icon: CookingPot })
  }

  const contextLabel = isRecipe ? 'receita' : isPlan ? 'plano' : 'refeição'

  const currentItems = tab === 'recipes'
    ? filteredRecipes.map((r) => ({
        id: r.id,
        name: r.name,
        calories: r.totals.calories,
        protein: r.totals.protein,
        carbs: r.totals.carbs,
        fat: r.totals.fat,
        kind: 'recipe' as const,
      }))
    : foods

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            Voltar
          </button>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
            {step === 'search' ? 'Buscar alimento' : 'Ajustar quantidade'}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 transition-colors duration-300">
            {step === 'search'
              ? `Escolha um alimento para adicionar à ${contextLabel}`
              : 'Defina a quantidade em gramas'}
          </p>
        </div>

        {step === 'search' ? (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 transition-colors duration-300">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 px-2 sm:px-3 ${
                    tab === t.key
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  {t.icon && <t.icon size={16} weight="bold" />}
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'public' && (
              <div className="mb-6">
                <FoodSearch value={search} onChange={setSearch} />
              </div>
            )}

            {tab === 'public' && search.trim().length < 2 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mb-1 transition-colors duration-300">
                  Busque um alimento
                </p>
                <p className="text-xs text-neutral-300 dark:text-neutral-600 max-w-xs transition-colors duration-300">
                  Digite o nome de qualquer alimento para ver suas informações nutricionais
                </p>
              </div>
            ) : isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) =>
                  tab === 'recipes' ? <RecipeCardSkeleton key={i} /> : tab === 'public' ? <FoodSkeleton key={i} /> : <PrivateFoodSkeleton key={i} />
                )}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-semibold text-red-500 mb-1">
                  {tab === 'recipes' ? 'Erro ao buscar receitas' : 'Erro ao buscar alimentos'}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">Verifique sua conexão e tente novamente</p>
              </div>
            ) : !currentItems || currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1 transition-colors duration-300">
                  {tab === 'public' ? `Nenhum resultado para "${search}"` : tab === 'private' ? 'Nenhum alimento cadastrado' : 'Nenhuma receita cadastrada'}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
                  {tab === 'public'
                    ? 'Tente um nome diferente ou mais genérico'
                    : tab === 'private'
                      ? 'Você ainda não cadastrou nenhum alimento privado'
                      : 'Você ainda não cadastrou nenhuma receita'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentItems.map((item) => (
                  <SelectableFoodCard key={`${item.kind}-${item.id}`} item={item} onSelect={handleSelectItem} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {selectedFood && (() => {
              const base = selectedFood.kind === 'private' && selectedFood.servingSize ? Number(selectedFood.servingSize) : 100
              const q = Number(quantity) || 0
              return (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-6 transition-colors duration-300">
                  <p className="text-base font-bold text-neutral-950 dark:text-neutral-100 mb-1 transition-colors duration-300">{selectedFood.name}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4 transition-colors duration-300">por {quantity || 0}g</p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
                    <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-200 tabular-nums leading-none transition-colors duration-300">
                      {Math.round((selectedFood.calories * q) / base)}
                    </span>
                    <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 pb-0.5 transition-colors duration-300">kcal</span>
                  </div>
                  <div className="flex gap-4">
                    {macros.map(({ key, label, colorClass }) => (
                      <div key={key} className="flex-1 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-1 transition-colors duration-300">{label}</span>
                        <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
                          {Math.round((selectedFood[key] * q) / base * 10) / 10}g
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {!targetId && (
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 text-sm font-semibold text-red-600 transition-colors duration-300">
                ID não encontrado. Volte e tente novamente.
              </div>
            )}

            <div className="mb-2">
              <label className="block text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3 transition-colors duration-300">
                Quantidade (g)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={2000}
                  className="w-full text-center text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-5 pr-14 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-all duration-200 shadow-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-extrabold text-neutral-400 dark:text-neutral-500 pointer-events-none select-none transition-colors duration-300">
                  g
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep('search')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!targetId || !quantity || Number(quantity) < 1 || anyPending}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                {anyPending ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {anyPending ? 'Adicionando…' : `Adicionar à ${contextLabel}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
