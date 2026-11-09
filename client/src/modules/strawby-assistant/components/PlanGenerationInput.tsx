import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUp } from 'lucide-react'
import { previewPlanSchema, type PreviewPlanData } from '../types/planGeneration'
import ActivityLevelSelect from './ActivityLevelSelect'

interface PlanGenerationInputProps {
  onSubmit: (data: PreviewPlanData) => void
  isPending: boolean
}

export default function PlanGenerationInput({ onSubmit, isPending }: PlanGenerationInputProps) {
  const { control, handleSubmit, watch } = useForm<PreviewPlanData>({
    resolver: zodResolver(previewPlanSchema),
  })

  // sem nível escolhido o envio trava — a escolha é do usuário
  const movementLevel = watch('movementLevel')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-red-600/30 dark:border-neutral-800 dark:bg-neutral-900 dark:focus-within:ring-red-600/40 sm:px-4 sm:py-2.5">
        <Controller
          name="movementLevel"
          control={control}
          render={({ field }) => (
            <ActivityLevelSelect value={field.value} onChange={field.onChange} disabled={isPending} />
          )}
        />

        <button
          type="submit"
          disabled={isPending || !movementLevel}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Calcular plano"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  )
}
