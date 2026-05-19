import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, CookingPot } from '@phosphor-icons/react'
import RecipeCard from './RecipeCard'
import RecipeCardSkeleton from '../skeletons/RecipeCardSkeleton'
import { useGetRecipes } from '../hooks/useGetRecipes'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export default function RecipeList() {
  const navigate = useNavigate()
  const { data: recipes, isPending, isError } = useGetRecipes()
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  if (isPending) {
    return (
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-semibold text-red-500 mb-1">Erro ao carregar receitas</p>
        <p className="text-xs text-neutral-400">Verifique sua conexão e tente novamente</p>
      </div>
    )
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-neutral-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <CookingPot size={28} weight="bold" className="text-rose-300" />
        </div>
        <p className="text-sm font-semibold text-neutral-600 mb-1">Nenhuma receita ainda</p>
        <p className="text-xs text-neutral-400 mb-6 max-w-xs">
          Crie sua primeira receita para montar refeições mais rapidamente
        </p>
        <button
          onClick={() => navigate('/app/recipes/new')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-colors duration-200 cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          Criar receita
        </button>
      </div>
    )
  }

  return (
    <motion.div
      className="flex flex-col gap-2.5 sm:gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {recipes.map((recipe) => (
        <motion.div key={recipe.id} variants={item}>
          <RecipeCard
            recipe={recipe}
            isOpen={openId === recipe.id}
            onToggle={() => toggle(recipe.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
