import type { PlanData } from './plan'

export interface PlanEditModalProps {
  isOpen: boolean
  onClose: () => void
  defaultValues: PlanData
  onSave: (data: PlanData) => void
  isPending: boolean
}
