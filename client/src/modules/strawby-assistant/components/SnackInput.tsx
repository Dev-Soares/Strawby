import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUp } from 'lucide-react'
import { getMealType, getMealAccent } from '@/shared/config/mealTypes'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import { suggestSnackSchema, type SuggestSnackData, type MealType } from '../types/snackSuggestion'
import MealTypeSelect from './MealTypeSelect'

interface SnackInputProps {
  onSubmit: (data: SuggestSnackData) => void
  isPending: boolean
}

export default function SnackInput({ onSubmit, isPending }: SnackInputProps) {
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const { control, handleSubmit, watch } = useForm<SuggestSnackData>({
    resolver: zodResolver(suggestSnackSchema),
    defaultValues: {
      maxResults: 3,
    },
  })

  // sem tipo escolhido a borda fica neutra e o envio trava — a escolha é do usuário
  const mealType = watch('mealType') as MealType | undefined
  const accent = mealType ? getMealAccent(getMealType(mealType), isDark) : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div
        className={`flex items-center gap-2 rounded-full border bg-white px-3 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-red-600/30 dark:bg-neutral-900 dark:focus-within:ring-red-600/40 sm:px-4 sm:py-2.5 ${
          accent ? '' : 'border-neutral-200 dark:border-neutral-800'
        }`}
        style={accent ? { borderColor: accent.strong } : undefined}
      >
        <Controller
          name="mealType"
          control={control}
          render={({ field }) => (
            <MealTypeSelect value={field.value} onChange={field.onChange} disabled={isPending} />
          )}
        />

        <button
          type="submit"
          disabled={isPending || !mealType}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Sugerir refeição"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  )
}
