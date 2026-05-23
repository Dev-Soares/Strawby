import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import RecipeForm from '../modules/recipe/components/RecipeForm'

export default function CreateRecipePage() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 sm:pt-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/app/foods')}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            Voltar
          </button>
          <h1             className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none">
            Nova Receita
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Crie uma receita com seus alimentos favoritos</p>
        </div>

        <RecipeForm onSuccess={(recipe) => navigate(`/app/recipes/${recipe.id}`)} />
      </div>
    </AppLayout>
  )
}
