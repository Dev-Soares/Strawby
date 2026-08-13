import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { toLocalISODate } from '@/shared/utils/date'
import { createMealSchema, type CreateMealData } from '../types/createMeal'
import { useCreateMeal } from './useCreateMeal'
import { useCopyMealItems } from './useCopyMealItems'
import type { Meal } from '../types/meal'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const useCreateMealForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isPlan = (searchParams.get('type') ?? 'meal') === 'plan-meal'
  const kind = isPlan ? 'PLAN' : 'DAILY'

  const dateParam = searchParams.get('date')
  const mealDate = dateParam && ISO_DATE.test(dateParam) ? dateParam : toLocalISODate()

  const [showPicker, setShowPicker] = useState(false)
  const [selectedPlanMeal, setSelectedPlanMeal] = useState<Meal | null>(null)

  const createMeal = useCreateMeal()
  const copyMealItems = useCopyMealItems()

  const form = useForm<CreateMealData>({
    resolver: zodResolver(createMealSchema),
    defaultValues: { time: '07:00', kind },
  })

  const selectPlanMeal = (meal: Meal) => {
    setSelectedPlanMeal(meal)
    setShowPicker(false)
    if (meal.mealType) {
      form.setValue('mealType', meal.mealType, { shouldValidate: true })
    }
  }

  const clearPlanMeal = () => {
    setSelectedPlanMeal(null)
    setShowPicker(false)
  }

  const togglePicker = () => setShowPicker((v) => !v)
  const closePicker = () => setShowPicker(false)

  const onSubmit = form.handleSubmit((data) => {
    createMeal.mutate(
      {
        kind,
        mealType: data.mealType,
        time: data.time,
        date: mealDate,
        observations: data.observations,
      },
      {
        onSuccess: async (createdMeal) => {
          if (!createdMeal?.id) {
            toast.error('Erro ao redirecionar. Tente novamente.')
            return
          }
          if (selectedPlanMeal) {
            try {
              await copyMealItems.mutateAsync({
                targetId: createdMeal.id,
                sourceMeal: selectedPlanMeal,
              })
            } catch {
              toast.error('Refeição criada, mas erro ao copiar itens do plano.')
            }
          }
          navigate(`/app/meals/${createdMeal.id}`)
        },
      },
    )
  })

  return {
    register: form.register,
    setValue: form.setValue,
    errors: form.formState.errors,
    selectedType: form.watch('mealType'),
    onSubmit,
    isPlan,
    showPicker,
    selectedPlanMeal,
    selectPlanMeal,
    clearPlanMeal,
    togglePicker,
    closePicker,
    isSubmitting: createMeal.isPending || copyMealItems.isPending,
  }
}
