import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Fire } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import FoodSearch from '../modules/food/components/FoodSearch'
import FoodSkeleton from '../modules/food/skeletons/FoodSkeleton'
import PrivateFoodSkeleton from '../modules/privateFood/skeletons/PrivateFoodSkeleton'
import { useSearchFood } from '../modules/food/hooks/useSearchFood'
import { useGetPrivateFoods } from '../modules/privateFood/hooks/useGetPrivateFoods'
import { useAddMealItem } from '../modules/meal/hooks/useAddMealItem'
import { useAddMealPrivateFoodItem } from '../modules/meal/hooks/useAddMealPrivateFoodItem'

type Tab = 'public' | 'private'

type SelectableFood = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  kind: Tab
  servingSize: string | null
}

const macros = [
  { key: 'protein' as const, label: 'Prot', colorClass: 'text-amber-500' },
  { key: 'carbs' as const, label: 'Carb', colorClass: 'text-blue-500' },
  { key: 'fat' as const, label: 'Gord', colorClass: 'text-violet-500' },
]

function SelectableFoodCard({ food, onSelect }: { food: SelectableFood; onSelect: (food: SelectableFood) => void }) {
  return (
    <div className="group bg-white border border-neutral-200 rounded-2xl p-4 hover:border-neutral-300 hover:shadow-md transition-all duration-200 relative">
      <button
        type="button"
        onClick={() => onSelect(food)}
        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors duration-150 cursor-pointer z-10"
        aria-label={`Adicionar ${food.name}`}
      >
        <Plus size={16} weight="bold" />
      </button>

      <div className="mb-3 pr-10">
        <p className="text-base font-bold text-neutral-950 leading-snug mb-0.5">
          {food.name}
        </p>
        <p className="text-xs font-medium text-neutral-400">
          {food.kind === 'private' && food.servingSize ? `por ${food.servingSize}g` : 'por 100g'}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
        <span className="text-xl font-extrabold text-neutral-900 tabular-nums leading-none">
          {Math.round(food.calories)}
        </span>
        <span className="text-xs font-medium text-neutral-400 pb-0.5">kcal</span>
      </div>

      <div className="flex gap-4">
        {macros.map(({ key, label, colorClass }) => (
          <div key={key} className="flex-1 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">{label}</span>
            <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
              {food[key]}g
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SelectFoodPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mealId = searchParams.get('mealId')

  const addMealItem = useAddMealItem()
  const addMealPrivateFoodItem = useAddMealPrivateFoodItem()

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
    data: privateFoods,
    isPending: isPrivatePending,
    isError: isPrivateError,
  } = useGetPrivateFoods()

  const filteredPrivateFoods = useMemo(() => {
    if (!privateFoods) return []
    const trimmed = search.trim().toLowerCase()
    if (trimmed.length < 2) return privateFoods
    return privateFoods.filter((f) => f.name.toLowerCase().includes(trimmed))
  }, [privateFoods, search])

  const foods: SelectableFood[] = useMemo(() => {
    if (tab === 'public') {
      return (publicFoods ?? []).map((f) => ({ ...f, kind: 'public' as const, servingSize: null }))
    }
    return filteredPrivateFoods.map((f) => ({ ...f, kind: 'private' as const, servingSize: f.servingSize }))
  }, [tab, publicFoods, filteredPrivateFoods])

  const isPending = tab === 'public' ? isPublicPending : isPrivatePending
  const isError = tab === 'public' ? isPublicError : isPrivateError

  const handleSelectFood = (food: SelectableFood) => {
    setSelectedFood(food)
    const defaultQuantity = food.kind === 'private' && food.servingSize ? food.servingSize : '100'
    setQuantity(defaultQuantity)
    setStep('quantity')
  }

  const handleConfirm = () => {
    if (!selectedFood || !mealId) {
      console.error('[SelectFoodPage] missing mealId or selectedFood', { mealId, selectedFood })
      return
    }

    const q = Number(quantity)
    const onSuccess = () => navigate(`/meals/${mealId}`)

    if (selectedFood.kind === 'public') {
      addMealItem.mutate(
        { mealId, dto: { foodId: selectedFood.id, quantity: q } },
        { onSuccess }
      )
    } else {
      addMealPrivateFoodItem.mutate(
        { mealId, dto: { privateFoodId: selectedFood.id, quantity: q } },
        { onSuccess }
      )
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

  const tabs: { key: Tab; label: string }[] = [
    { key: 'public', label: 'Todos' },
    { key: 'private', label: 'Meus alimentos' },
  ]

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <ArrowLeft size={18} weight="bold" className="text-red-600" />
          </button>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none">
              {step === 'search' ? 'Buscar alimento' : 'Ajustar quantidade'}
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              {step === 'search'
                ? 'Escolha um alimento para adicionar à refeição'
                : 'Defina a quantidade em gramas'}
            </p>
          </div>
        </div>

        {step === 'search' ? (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-neutral-100 rounded-xl p-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                    tab === t.key
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <FoodSearch value={search} onChange={setSearch} />
            </div>

            {search.trim().length < 2 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm font-semibold text-neutral-400 mb-1">Busque um alimento</p>
                <p className="text-xs text-neutral-300 max-w-xs">
                  {tab === 'public'
                    ? 'Digite o nome de qualquer alimento para ver suas informações nutricionais'
                    : 'Digite para filtrar seus alimentos privados'}
                </p>
              </div>
            ) : isPending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) =>
                  tab === 'public' ? <FoodSkeleton key={i} /> : <PrivateFoodSkeleton key={i} />
                )}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-semibold text-red-500 mb-1">Erro ao buscar alimentos</p>
                <p className="text-xs text-neutral-400">Verifique sua conexão e tente novamente</p>
              </div>
            ) : !foods || foods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-semibold text-neutral-600 mb-1">
                  Nenhum resultado para &quot;{search}&quot;
                </p>
                <p className="text-xs text-neutral-400">
                  {tab === 'public'
                    ? 'Tente um nome diferente ou mais genérico'
                    : 'Você ainda não cadastrou nenhum alimento privado'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-neutral-500 mb-4">
                  {foods.length} alimento{foods.length !== 1 ? 's' : ''} encontrado{foods.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {foods.map((food) => (
                    <SelectableFoodCard key={`${food.kind}-${food.id}`} food={food} onSelect={handleSelectFood} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {selectedFood && (() => {
              const base = selectedFood.kind === 'private' && selectedFood.servingSize ? Number(selectedFood.servingSize) : 100
              const q = Number(quantity) || 0
              return (
                <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-6">
                  <p className="text-base font-bold text-neutral-950 mb-1">{selectedFood.name}</p>
                  <p className="text-xs text-neutral-400 mb-4">por {quantity || 0}g</p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
                    <span className="text-xl font-extrabold text-neutral-900 tabular-nums leading-none">
                      {Math.round((selectedFood.calories * q) / base)}
                    </span>
                    <span className="text-xs font-medium text-neutral-400 pb-0.5">kcal</span>
                  </div>
                  <div className="flex gap-4">
                    {macros.map(({ key, label, colorClass }) => (
                      <div key={key} className="flex-1 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">{label}</span>
                        <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
                          {Math.round((selectedFood[key] * q) / base * 10) / 10}g
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {!mealId && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-600">
                ID da refeição não encontrado. Volte e tente novamente.
              </div>
            )}

            <div className="mb-2">
              <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
                Quantidade (g)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={2000}
                  className="w-full text-center text-3xl font-extrabold text-neutral-950 bg-white border border-neutral-200 rounded-2xl px-4 py-5 pr-14 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 shadow-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-extrabold text-neutral-400 pointer-events-none select-none">
                  g
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep('search')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors duration-150 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!mealId || !quantity || Number(quantity) < 1 || addMealItem.isPending || addMealPrivateFoodItem.isPending}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                {addMealItem.isPending || addMealPrivateFoodItem.isPending ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {addMealItem.isPending || addMealPrivateFoodItem.isPending ? 'Adicionando…' : 'Adicionar à refeição'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
