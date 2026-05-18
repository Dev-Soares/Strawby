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

interface UsePrivateFoodFormOptions {
  onSuccess?: () => void
}

export const usePrivateFoodForm = (opts?: UsePrivateFoodFormOptions) => {
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
      servingSize: food.servingSize ?? '',
    })
  }

  const onSubmit = form.handleSubmit(async (data) => {
    if (mode === 'create') {
      await createMutation.mutateAsync(data)
      startCreate()
      opts?.onSuccess?.()
    } else if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, dto: data })
      startCreate()
      opts?.onSuccess?.()
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
