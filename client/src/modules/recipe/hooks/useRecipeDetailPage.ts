import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetRecipe } from './useGetRecipe'
import { useDeleteRecipe } from './useDeleteRecipe'
import { useRemoveRecipeItem } from './useRemoveRecipeItem'
import { useUpdateRecipe } from './useUpdateRecipe'

export type RecipeConfirmState =
  | { type: 'recipe'; id: string; name: string }
  | { type: 'recipeItem'; recipeId: string; itemId: string; name: string }
  | null

export const useRecipeDetailPage = (recipeId: string) => {
  const navigate = useNavigate()
  const query = useGetRecipe(recipeId)
  const deleteMutation = useDeleteRecipe()
  const removeItem = useRemoveRecipeItem()
  const updateMutation = useUpdateRecipe()

  const [confirm, setConfirm] = useState<RecipeConfirmState>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')

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
        { onSuccess: () => setConfirm(null) },
      )
    }
  }

  const isDeletePending =
    confirm?.type === 'recipe'
      ? deleteMutation.isPending
      : confirm?.type === 'recipeItem'
        ? removeItem.isPending
        : false

  const startEditingName = (currentName: string) => {
    setEditName(currentName)
    setIsEditingName(true)
  }

  const saveName = () => {
    if (!query.data) return
    const recipe = query.data
    if (!editName.trim() || editName === recipe.name) {
      setIsEditingName(false)
      return
    }
    updateMutation.mutate(
      { id: recipe.id, name: editName.trim() },
      { onSuccess: () => setIsEditingName(false) },
    )
  }

  return {
    recipe: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    confirm,
    setConfirm,
    handleConfirm,
    isDeletePending,
    deleteMutation,
    removeItem,
    updateMutation,
    isEditingName,
    setIsEditingName,
    editName,
    setEditName,
    startEditingName,
    saveName,
    navigate,
  }
}
