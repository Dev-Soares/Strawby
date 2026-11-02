import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUp } from 'lucide-react'
import {
  suggestSubstitutionSchema,
  substitutionGoalValues,
  type SuggestSubstitutionData,
} from '../types/substitution'

interface SubstitutionInputProps {
  onSubmit: (data: SuggestSubstitutionData) => void
  isPending: boolean
}

const goalLabels: Record<string, string> = {
  'less-carbs': 'Menos carboidratos',
  'more-protein': 'Mais proteína',
  'less-calories': 'Menos calorias',
  'more-fiber': 'Mais fibras',
  vegetarian: 'Vegetariano',
  vegan: 'Vegano',
  'lower-fat': 'Menos gordura',
  'lactose-free': 'Sem lactose',
  'gluten-free': 'Sem glúten',
}

export default function SubstitutionInput({ onSubmit, isPending }: SubstitutionInputProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuggestSubstitutionData>({
    resolver: zodResolver(suggestSubstitutionSchema),
    defaultValues: {
      goal: 'less-carbs',
      maxResults: 3,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-red-600/30 dark:focus-within:ring-red-600/40">
        <input
          {...register('foodName')}
          placeholder="Qual alimento você quer substituir?"
          disabled={isPending}
          className="w-full bg-transparent border-0 p-0 text-sm text-neutral-950 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-0 disabled:opacity-60"
        />

        <div className="flex items-center gap-2">
          <select
            {...register('goal')}
            disabled={isPending}
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-600/30"
          >
            {substitutionGoalValues.map((goal) => (
              <option key={goal} value={goal}>
                {goalLabels[goal]}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isPending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Sugerir substituições"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

      {errors.foodName && (
        <p className="absolute -top-6 left-0 text-xs text-red-500">{errors.foodName.message}</p>
      )}
    </form>
  )
}
