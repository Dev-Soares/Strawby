import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cookie } from 'lucide-react'
import { suggestSnackSchema, mealTypeValues, type SuggestSnackData } from '../types/snackSuggestion'

interface SnackInputProps {
  onSubmit: (data: SuggestSnackData) => void
  isPending: boolean
}

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Café da manhã',
  lunch: 'Almoço',
  snack: 'Lanche',
  dinner: 'Jantar',
  supper: 'Ceia',
}

export default function SnackInput({ onSubmit, isPending }: SnackInputProps) {
  const { register, handleSubmit } = useForm<SuggestSnackData>({
    resolver: zodResolver(suggestSnackSchema),
    defaultValues: {
      mealType: 'snack',
      maxResults: 3,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-red-600/30 dark:focus-within:ring-red-600/40">
        <Cookie size={18} className="shrink-0 text-neutral-500 dark:text-neutral-500" />
        <select
          {...register('mealType')}
          disabled={isPending}
          className="flex-1 bg-transparent border-0 p-0 text-sm text-neutral-950 dark:text-neutral-100 focus:outline-none focus:ring-0 disabled:opacity-60"
        >
          {mealTypeValues.map((mealType) => (
            <option key={mealType} value={mealType}>
              {mealTypeLabels[mealType]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Sugerir lanche"
        >
          <Cookie size={18} />
        </button>
      </div>
    </form>
  )
}
