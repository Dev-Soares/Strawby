import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  createPrivateFoodSchema,
  type CreatePrivateFoodData,
  type PrivateFood,
} from '../types/privateFood'
import { useCreatePrivateFood } from './useCreatePrivateFood'
import { useUpdatePrivateFood } from './useUpdatePrivateFood'

type FormMode = 'create' | 'edit'

export const usePrivateFoodForm = () => {
  const [mode, setMode] = useState<FormMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)

  const createMutation = useCreatePrivateFood()
  const updateMutation = useUpdatePrivateFood()

  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<CreatePrivateFoodData>({
    resolver: zodResolver(createPrivateFoodSchema),
    defaultValues: {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: undefined,
      sodium: undefined,
      servingSize: '',
    },
  })

  const startCreate = () => {
    setMode('create')
    setEditingId(null)
    form.reset({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: undefined,
      sodium: undefined,
      servingSize: '',
    })
  }

  const startEdit = (food: PrivateFood) => {
    setMode('edit')
    setEditingId(food.id)
    form.reset({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber ?? undefined,
      sodium: food.sodium ?? undefined,
      servingSize: food.servingSize ?? '',
    })
  }

  const onSubmit = form.handleSubmit((data) => {
    if (mode === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => startCreate(),
      })
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, dto: data }, {
        onSuccess: () => startCreate(),
      })
    }
  })

  return {
    ...form,
    onSubmit,
    mode,
    isPending,
    startCreate,
    startEdit,
  }
}
