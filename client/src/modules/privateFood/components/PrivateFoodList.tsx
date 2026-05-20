import { useState } from 'react'
import { motion } from 'framer-motion'
import { PencilSimple, Trash, Fire } from '@phosphor-icons/react'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'
import type { PrivateFood } from '../types/privateFood'
import { useDeletePrivateFood } from '../hooks/useDeletePrivateFood'

const macros = [
  { key: 'protein' as const, label: 'Prot', colorClass: 'text-amber-500' },
  { key: 'carbs' as const, label: 'Carb', colorClass: 'text-blue-500' },
  { key: 'fat' as const, label: 'Gord', colorClass: 'text-violet-500' },
]

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

interface PrivateFoodListProps {
  foods: PrivateFood[]
  onEdit: (food: PrivateFood) => void
}

export default function PrivateFoodList({ foods, onEdit }: PrivateFoodListProps) {
  const deleteMutation = useDeletePrivateFood()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const confirmFood = foods.find((f) => f.id === confirmId) ?? null

  return (
    <motion.div
      className="flex flex-col gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {foods.map((food) => (
        <motion.div
          key={food.id}
          variants={item}
          className="group bg-white border border-neutral-200 rounded-2xl p-4 hover:border-neutral-300 transition-all duration-200 relative"
        >
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(food)}
              className="w-8 h-8 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-500 flex items-center justify-center transition-colors duration-150 cursor-pointer"
              aria-label={`Editar ${food.name}`}
            >
              <PencilSimple size={14} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmId(food.id)}
              disabled={deleteMutation.isPending}
              className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors duration-150 cursor-pointer disabled:opacity-50"
              aria-label={`Remover ${food.name}`}
            >
              <Trash size={14} weight="bold" />
            </button>
          </div>

          <div className="mb-3 pr-20">
            <p className="text-base font-bold text-neutral-950 leading-snug mb-1">{food.name}</p>
            <p className="text-base font-bold text-neutral-600 tabular-nums">
              {food.servingSize ? `${food.servingSize}g` : '100g'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
            <span className="text-xl font-extrabold text-neutral-900 tabular-nums leading-none">
              {Math.round(food.calories)}
            </span>
            <span className="text-xs font-medium text-neutral-400 pb-0.5">kcal</span>
          </div>

          <div className="flex gap-4">
            {macros.map(({ key, label, colorClass }) => (
              <div key={key} className="flex-1 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">{label}</span>
                <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
                  {food[key]}g
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <ConfirmDeleteModal
        isOpen={!!confirmFood}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmFood) {
            deleteMutation.mutate(confirmFood.id, {
              onSuccess: () => setConfirmId(null),
            })
          }
        }}
        title={confirmFood ? `Remover "${confirmFood.name}"?` : 'Tem certeza?'}
        description="O alimento será excluído permanentemente."
        confirmLabel="Remover"
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  )
}
