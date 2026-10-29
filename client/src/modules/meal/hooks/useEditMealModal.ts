import { useState } from 'react'
import { useUpdateMeal } from './useUpdateMeal'
import type { UpdateMealData } from '../types/updateMeal'

type Params = {
  mealId: string
  patientId?: string
}

export const useEditMealModal = ({ mealId, patientId }: Params) => {
  const updateMeal = useUpdateMeal(patientId)
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const handleSave = (data: UpdateMealData) => {
    updateMeal.mutate(
      {
        mealId,
        data: {
          mealType: data.mealType,
          observations: data.observations?.trim() ?? '',
          ...(data.time ? { time: data.time } : {}),
        },
      },
      { onSuccess: close },
    )
  }

  return {
    isOpen,
    open,
    close,
    handleSave,
    isPending: updateMeal.isPending,
  }
}
