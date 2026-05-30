import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMealItemService } from '../service/addMealItemService'
import { addMealPrivateFoodItemService } from '../service/addMealPrivateFoodItemService'
import { addMealRecipeService } from '../service/addMealRecipeService'
import type { Meal } from '../types/meal'

export const useCopyMealItems = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ targetId, sourceMeal }: { targetId: string; sourceMeal: Meal }) => {
      for (const item of sourceMeal.items) {
        if (item.food) {
          await addMealItemService(targetId, { foodId: item.food.id, quantity: item.quantity })
        } else if (item.privateFood) {
          await addMealPrivateFoodItemService(targetId, { privateFoodId: item.privateFood.id, quantity: item.quantity })
        }
      }
      for (const recipe of sourceMeal.recipes) {
        await addMealRecipeService(targetId, { recipeId: recipe.id })
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.targetId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', new Date().toISOString().split('T')[0]] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
    },
  })
}
