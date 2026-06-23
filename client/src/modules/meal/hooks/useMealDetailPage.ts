import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGetMeal } from './useGetMeal'
import { useDeleteMeal } from './useDeleteMeal'
import { useRemoveMealItem } from './useRemoveMealItem'
import { useUpdateMealItem } from './useUpdateMealItem'
import { useRemoveMealRecipe } from './useRemoveMealRecipe'

export type MealConfirmState =
  | { type: 'meal'; id: string; name: string }
  | { type: 'mealItem'; mealId: string; itemId: string; name: string }
  | { type: 'mealRecipe'; mealId: string; recipeId: string; name: string }
  | null

type Params = {
  mealId: string
  patientId?: string
}

export const useMealDetailPage = ({ mealId, patientId }: Params) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const query = useGetMeal(mealId, patientId)
  const deleteMutation = useDeleteMeal(patientId)
  const removeItem = useRemoveMealItem(patientId)
  const updateItem = useUpdateMealItem(patientId)
  const removeRecipe = useRemoveMealRecipe(patientId)
  const [confirm, setConfirm] = useState<MealConfirmState>(null)

  const isPlan = query.data?.kind === 'PLAN'
  const backPath = patientId
    ? `/app/nutritionist/patient/${patientId}`
    : isPlan ? '/app/plan' : '/app/home'

  const selectFoodPath = query.data
    ? `/app/foods/select?mealId=${query.data.id}&type=${isPlan ? 'plan-meal' : 'meal'}${patientId ? `&patientId=${patientId}` : ''}`
    : ''

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
        { onSuccess: () => setConfirm(null) },
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

  return {
    meal: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    confirm,
    setConfirm,
    handleConfirm,
    isDeletePending,
    deleteMutation,
    removeItem,
    updateItem,
    removeRecipe,
    backPath,
    selectFoodPath,
    isPlan,
    navigate,
  }
}
