import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchFood } from './useSearchFood'
import { useGetPrivateFoods } from '../../private-food/hooks/useGetPrivateFoods'
import { useGetRecipes } from '../../recipe/hooks/useGetRecipes'
import { useAddMealItem } from '../../meal/hooks/useAddMealItem'
import { useAddMealPrivateFoodItem } from '../../meal/hooks/useAddMealPrivateFoodItem'
import { useAddMealRecipe } from '../../meal/hooks/useAddMealRecipe'
import { useAddRecipeItem } from '../../recipe/hooks/useAddRecipeItem'
import { useAddRecipePrivateFoodItem } from '../../recipe/hooks/useAddRecipePrivateFoodItem'
import type { SelectableFood, SelectableItem, SelectFoodTab } from '../types/selectableItem'

type Step = 'search' | 'quantity'

export const useSelectFoodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const mealId = searchParams.get('mealId')
  const recipeId = searchParams.get('recipeId')
  const type = searchParams.get('type') ?? 'meal'
  const patientId = searchParams.get('patientId') ?? undefined

  const isRecipe = !!recipeId
  const targetId = mealId ?? recipeId ?? ''
  const isPlan = type === 'plan-meal'

  const addMealItem = useAddMealItem(patientId)
  const addMealPrivateFoodItem = useAddMealPrivateFoodItem(patientId)
  const addMealRecipe = useAddMealRecipe(patientId)
  const addRecipeItem = useAddRecipeItem()
  const addRecipePrivateFoodItem = useAddRecipePrivateFoodItem()

  const [tab, setTab] = useState<SelectFoodTab>('public')
  const [search, setSearch] = useState('')
  const [step, setStep] = useState<Step>('search')
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

  const {
    data: recipes,
    isPending: isRecipesPending,
    isError: isRecipesError,
  } = useGetRecipes()

  const foods: SelectableFood[] = useMemo(() => {
    if (tab === 'public') {
      return (publicFoods ?? []).map((f) => ({ ...f, kind: 'public' as const, servingSize: null }))
    }
    return (privateFoods ?? []).map((f) => ({ ...f, kind: 'private' as const, servingSize: f.servingSize }))
  }, [tab, publicFoods, privateFoods])

  const recipeItems: SelectableItem[] = useMemo(() => {
    if (!recipes) return []
    return recipes.map((r) => ({
      id: r.id,
      name: r.name,
      calories: r.totals.calories,
      protein: r.totals.protein,
      carbs: r.totals.carbs,
      fat: r.totals.fat,
      kind: 'recipe' as const,
    }))
  }, [recipes])

  const isPending = tab === 'public' ? isPublicPending : tab === 'private' ? isPrivatePending : isRecipesPending
  const isError = tab === 'public' ? isPublicError : tab === 'private' ? isPrivateError : isRecipesError

  const anyPending =
    addMealItem.isPending || addMealPrivateFoodItem.isPending || addMealRecipe.isPending
    || addRecipeItem.isPending || addRecipePrivateFoodItem.isPending

  const currentItems: SelectableItem[] = tab === 'recipes' ? recipeItems : foods

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
      return
    }
    const q = Number(quantity)

    if (isRecipe) {
      const onSuccess = async () => {
        await queryClient.refetchQueries({ queryKey: ['recipe', targetId], type: 'all' })
        navigate(`/app/recipes/${targetId}`)
      }
      if (selectedFood.kind === 'public') {
        addRecipeItem.mutate(
          { recipeId: targetId, dto: { foodId: selectedFood.id, quantity: q } },
          { onSuccess },
        )
      } else {
        addRecipePrivateFoodItem.mutate(
          { recipeId: targetId, dto: { privateFoodId: selectedFood.id, quantity: q } },
          { onSuccess },
        )
      }
      return
    }

    const onMealSuccess = async () => {
      await queryClient.refetchQueries({ queryKey: ['meal', targetId], type: 'all' })
      navigate(`/app/meals/${targetId}${patientId ? `?patientId=${patientId}` : ''}`)
    }

    if (selectedFood.kind === 'public') {
      addMealItem.mutate(
        { mealId: targetId, dto: { foodId: selectedFood.id, quantity: q } },
        { onSuccess: onMealSuccess },
      )
    } else {
      addMealPrivateFoodItem.mutate(
        { mealId: targetId, dto: { privateFoodId: selectedFood.id, quantity: q } },
        { onSuccess: onMealSuccess },
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

  return {
    tab, setTab,
    search, setSearch,
    step, setStep,
    selectedFood,
    quantity, setQuantity,
    isPending, isError,
    currentItems,
    anyPending,
    isRecipe,
    isPlan,
    targetId,
    handleSelectItem,
    handleConfirm,
    handleBack,
  }
}
