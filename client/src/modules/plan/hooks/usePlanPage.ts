import { useState } from 'react'
import { useGetPlan } from './useGetPlan'
import { useEditPlan } from './useEditPlan'
import { useCreatePlan } from './useCreatePlan'
import { useDeletePlan } from './useDeletePlan'
import { MACROS } from '@/shared/config/macros'
import { macroKcalTotal, macroKcalShare } from '@/shared/utils/nutrition'
import type { PlanData } from '../types/plan'
import type { CreatePlanData } from '../types/createPlan'

type CreateMode = 'select' | 'manual' | 'generate'

export const usePlanPage = () => {
  const { data: plan, isPending, isError } = useGetPlan()
  const editMutation = useEditPlan()
  const createMutation = useCreatePlan()
  const deleteMutation = useDeletePlan()

  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [createMode, setCreateMode] = useState<CreateMode>('select')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const openCreate = (mode: CreateMode = 'select') => {
    setCreateMode(mode)
    setCreateOpen(true)
  }

  /** Regerar plano = apagar o atual e abrir o fluxo de geração */
  const confirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setConfirmDeleteOpen(false)
        openCreate('generate')
      },
    })
  }

  const savePlan = (data: PlanData) =>
    editMutation.mutate(data, { onSuccess: () => setEditOpen(false) })

  const submitCreate = (data: CreatePlanData) =>
    createMutation.mutate(data, { onSuccess: () => setCreateOpen(false) })

  const macroRows = plan
    ? MACROS.map((macro) => ({
        ...macro,
        value: plan[macro.field],
        pct: macroKcalShare(macro.field, plan),
      }))
    : []

  return {
    plan,
    isPending,
    isError,
    macroRows,
    totalMacroKcal: plan ? macroKcalTotal(plan) : 0,

    editOpen,
    openEdit: () => setEditOpen(true),
    closeEdit: () => setEditOpen(false),
    savePlan,
    isSaving: editMutation.isPending,

    createOpen,
    createMode,
    openCreate,
    closeCreate: () => setCreateOpen(false),
    submitCreate,
    isCreating: createMutation.isPending,

    confirmDeleteOpen,
    openConfirmDelete: () => setConfirmDeleteOpen(true),
    closeConfirmDelete: () => setConfirmDeleteOpen(false),
    confirmDelete,
    isDeleting: deleteMutation.isPending,
  }
}
