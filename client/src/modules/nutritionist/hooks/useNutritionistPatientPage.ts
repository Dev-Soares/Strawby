import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toLocalISODate } from '@/shared/utils/date'
import { useGetPatients } from './useGetPatients'
import { useGetPatientPlan } from './useGetPatientPlan'
import { useCreatePatientPlan } from './useCreatePatientPlan'
import { useEditPatientPlan } from './useEditPatientPlan'
import { useDeletePatientPlan } from './useDeletePatientPlan'
import { useGetPatientPlanMeals } from './useGetPatientPlanMeals'
import { useCreatePatientPlanMeal } from './useCreatePatientPlanMeal'
import { useDeletePatientPlanMeal } from './useDeletePatientPlanMeal'
import { useRemovePatient } from './useRemovePatient'

export type CreatePlanMode = 'select' | 'manual' | 'generate'

export const useNutritionistPatientPage = (patientId: string) => {
  const id = patientId
  const navigate = useNavigate()
  const { data: patients } = useGetPatients()
  const patient = patients?.find((p) => p.id === id)
  const hasBodyData = !!(patient?.weight && patient?.height && patient?.age && patient?.gender)

  const { data: plan, isPending: planPending } = useGetPatientPlan(id)
  const createPlanMutation = useCreatePatientPlan(id)
  const editPlanMutation = useEditPatientPlan(id)
  const deletePlanMutation = useDeletePatientPlan(id)

  const { data: meals, isPending: mealsPending } = useGetPatientPlanMeals(id)
  const createMealMutation = useCreatePatientPlanMeal(id)
  const deleteMealMutation = useDeletePatientPlanMeal(id)
  const removePatientMutation = useRemovePatient()

  const [createPlanOpen, setCreatePlanOpen] = useState(false)
  const [createPlanMode, setCreatePlanMode] = useState<CreatePlanMode>('select')
  const [editPlanOpen, setEditPlanOpen] = useState(false)
  const [confirmDeletePlan, setConfirmDeletePlan] = useState(false)
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [confirmDeleteMealId, setConfirmDeleteMealId] = useState<string | null>(null)
  const [confirmRemovePatient, setConfirmRemovePatient] = useState(false)

  const todayStr = toLocalISODate()
  const [diaryDay, setDiaryDay] = useState(todayStr)

  const prevDay = useCallback(() => {
    setDiaryDay((d) => {
      const [year, month, day] = d.split('-').map(Number)
      const date = new Date(year, month - 1, day - 1)
      return toLocalISODate(date)
    })
  }, [])

  const nextDay = useCallback(() => {
    setDiaryDay((d) => {
      const [year, month, day] = d.split('-').map(Number)
      const date = new Date(year, month - 1, day + 1)
      return toLocalISODate(date)
    })
  }, [])

  const openCreatePlan = (mode: CreatePlanMode) => {
    setCreatePlanMode(mode)
    setCreatePlanOpen(true)
  }

  const handleDeletePlan = () => {
    deletePlanMutation.mutate(undefined, { onSuccess: () => setConfirmDeletePlan(false) })
  }

  const handleDeleteMeal = (mealId: string) => {
    deleteMealMutation.mutate(mealId, { onSuccess: () => setConfirmDeleteMealId(null) })
  }

  const handleRemovePatient = () => {
    removePatientMutation.mutate(id, {
      onSuccess: () => {
        setConfirmRemovePatient(false)
        navigate('/app/home')
      },
    })
  }

  return {
    id,
    patient,
    hasBodyData,
    plan,
    planPending,
    meals,
    mealsPending,
    createPlanMutation,
    editPlanMutation,
    deletePlanMutation,
    createMealMutation,
    deleteMealMutation,
    createPlanOpen,
    setCreatePlanOpen,
    createPlanMode,
    openCreatePlan,
    editPlanOpen,
    setEditPlanOpen,
    confirmDeletePlan,
    setConfirmDeletePlan,
    addMealOpen,
    setAddMealOpen,
    confirmDeleteMealId,
    setConfirmDeleteMealId,
    handleDeletePlan,
    handleDeleteMeal,
    confirmRemovePatient,
    setConfirmRemovePatient,
    handleRemovePatient,
    removePatientMutation,
    diaryDay,
    prevDay,
    nextDay,
    isDiaryToday: diaryDay === todayStr,
  }
}
