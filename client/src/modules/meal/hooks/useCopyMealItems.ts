import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { addMealItemService } from '../service/addMealItemService'
import { addMealPrivateFoodItemService } from '../service/addMealPrivateFoodItemService'
import { addMealRecipeService } from '../service/addMealRecipeService'
import { toLocalISODate } from '@/shared/utils/date'
import type { Meal } from '../types/meal'

export const useCopyMealItems = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: async ({ targetId, sourceMeal }: { targetId: string; sourceMeal: Meal }) => {
      const patientId = user!.id
      for (const item of sourceMeal.items) {
        if (item.food) {
          await addMealItemService(patientId, targetId, { foodId: item.food.id, quantity: item.quantity })
        } else if (item.privateFood) {
          await addMealPrivateFoodItemService(patientId, targetId, { privateFoodId: item.privateFood.id, quantity: item.quantity })
        }
      }
      for (const recipe of sourceMeal.recipes) {
        await addMealRecipeService(patientId, targetId, { recipeId: recipe.id })
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.targetId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', toLocalISODate()] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
    },
  })
}
