import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FloppyDisk } from '@phosphor-icons/react'
import { createRecipeSchema, type CreateRecipeData } from '../types/createRecipe'
import { useCreateRecipe } from '../hooks/useCreateRecipe'

interface RecipeFormProps {
  onSuccess?: (recipe: { id: string }) => void
}

export default function RecipeForm({ onSuccess }: RecipeFormProps) {
  const createRecipe = useCreateRecipe()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRecipeData>({
    resolver: zodResolver(createRecipeSchema),
  })

  const onSubmit = handleSubmit((data) => {
    createRecipe.mutate(data, {
      onSuccess: (recipe) => {
        onSuccess?.(recipe)
      },
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
          Nome da receita
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Ex: Omelete de claras"
          className="w-full text-lg font-bold text-neutral-950 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-neutral-500 pb-2 transition-colors duration-150 placeholder:text-neutral-300"
        />
        {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
      </div>

      <button
        type="submit"
        disabled={createRecipe.isPending}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white transition-colors duration-200 cursor-pointer bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createRecipe.isPending ? (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <FloppyDisk size={17} weight="bold" />
        )}
        {createRecipe.isPending ? 'Salvando…' : 'Salvar receita'}
      </button>
    </form>
  )
}
