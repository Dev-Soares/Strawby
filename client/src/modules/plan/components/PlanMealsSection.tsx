import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, CaretDown, Trash } from '@phosphor-icons/react'
import { Coffee, ForkKnife, Leaf, Moon, Cookie } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { useGetPlanMeals } from '../../plan-meal/hooks/useGetPlanMeals'
import { useDeletePlanMeal } from '../../plan-meal/hooks/useDeletePlanMeal'
import PlanMealsSectionSkeleton from '../skeletons/PlanMealsSectionSkeleton'
import type { PlanMealSummary } from '../../plan-meal/types/planMeal'

interface MealTypeConfig {
  icon: Icon
  label: string
  accent: string
  accentLight: string
  accentText: string
}

const mealTypeConfig: Record<string, MealTypeConfig> = {
  breakfast: { icon: Coffee, label: 'MANHÃ', accent: '#ea580c', accentLight: '#fed7aa', accentText: '#c2410c' },
  lunch: { icon: ForkKnife, label: 'ALMOÇO', accent: '#16a34a', accentLight: '#bbf7d0', accentText: '#15803d' },
  snack: { icon: Leaf, label: 'LANCHE', accent: '#2563eb', accentLight: '#bfdbfe', accentText: '#1d4ed8' },
  dinner: { icon: Moon, label: 'JANTAR', accent: '#9333ea', accentLight: '#e9d5ff', accentText: '#7e22ce' },
  supper: { icon: Cookie, label: 'CEIA', accent: '#475569', accentLight: '#cbd5e1', accentText: '#334155' },
}

function PlanMealCard({
  meal,
  isOpen,
  onToggle,
}: {
  meal: PlanMealSummary
  isOpen: boolean
  onToggle: () => void
}) {
  const navigate = useNavigate()
  const deleteMutation = useDeletePlanMeal()
  const config = mealTypeConfig[meal.type || ''] || mealTypeConfig.breakfast
  const MealIcon = config.icon
  const totalKcal = Math.round(meal.totals.calories)

  return (
    <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Card body */}
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: config.accentLight }}
          >
            <MealIcon size={18} weight="bold" style={{ color: config.accentText }} />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: config.accentLight, color: config.accentText }}
            >
              {config.label}
            </span>
            <button
              type="button"
              onClick={() => deleteMutation.mutate(meal.id)}
              disabled={deleteMutation.isPending}
              className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-red-100 text-neutral-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remover refeição"
            >
              {deleteMutation.isPending ? (
                <span className="inline-block w-3 h-3 border-2 border-neutral-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <Trash size={14} weight="bold" />
              )}
            </button>
          </div>
        </div>

        {/* Kcal */}
        <div className="mb-1">
          <span
            className="font-display text-5xl font-extrabold leading-none tabular-nums"
            style={{ color: config.accent }}
          >
            {totalKcal}
          </span>
          <span className="text-lg font-bold text-neutral-400 ml-2">kcal</span>
        </div>
        <p
          className="font-display text-base font-bold mb-0.5"
          style={{ color: config.accentText }}
        >
          {meal.name}
        </p>

        {/* Macro chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-4">
          {[
            { l: 'Proteína', v: Math.round(meal.totals.protein) },
            { l: 'Carbos', v: Math.round(meal.totals.carbs) },
            { l: 'Gordura', v: Math.round(meal.totals.fat) },
          ].map(({ l, v }) => (
            <span
              key={l}
              className="text-sm font-bold px-3 py-1.5 rounded-full tabular-nums"
              style={{ backgroundColor: config.accentLight, color: config.accentText }}
            >
              {v}g {l}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center border-t border-neutral-100">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
          style={{ color: config.accentText }}
        >
          <span className="text-sm font-bold">
            Ver detalhes
          </span>
          <CaretDown
            size={16}
            weight="bold"
            className="transition-transform duration-250"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
        <div className="w-px h-6 bg-neutral-100" />
        <button
          type="button"
          onClick={() => navigate(`/foods/select?mealId=${meal.id}&type=plan-meal`)}
          className="flex items-center gap-1.5 px-5 py-3.5 text-sm font-bold hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
          style={{ color: config.accentText }}
        >
          <Plus size={15} weight="bold" />
          Adicionar
        </button>
      </div>

      {/* Detail placeholder — animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-neutral-100 px-5 py-4">
              <p className="text-xs text-neutral-400">Detalhes dos itens em breve</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PlanMealsSection() {
  const { data: meals, isPending, isError, error } = useGetPlanMeals()
  const [openId, setOpenId] = useState<string | null>(null)
  const navigate = useNavigate()

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  const totalKcal = meals?.reduce((a, m) => a + m.totals.calories, 0) ?? 0

  return (
    <motion.div
      className="px-4 sm:px-10 lg:px-16 pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-none">
            Refeições planejadas
          </h2>
          <p className="text-sm text-neutral-500 mt-1.5">Distribuição do seu plano ao longo do dia</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-500 tabular-nums hidden sm:block">
            {meals?.length ?? 0} refeições · {Math.round(totalKcal).toLocaleString('pt-BR')} kcal total
          </span>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
              navigate('/meals/new?type=plan-meal')
            }}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors duration-150 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Plus size={15} weight="bold" />
            Nova refeição
          </button>
        </div>
      </motion.div>

      {isPending && <PlanMealsSectionSkeleton />}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <p className="text-sm font-semibold text-red-600">Erro ao carregar refeições planejadas</p>
          <p className="text-xs text-red-400 mt-1">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      )}

      {meals && meals.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm font-semibold text-neutral-500 mb-1">Nenhuma refeição planejada</p>
          <p className="text-xs text-neutral-400">Clique em "Nova refeição" para começar</p>
        </div>
      )}

      {meals && meals.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {meals.map((meal) => (
            <motion.div
              key={meal.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
              }}
            >
              <PlanMealCard
                meal={meal}
                isOpen={openId === meal.id}
                onToggle={() => toggle(meal.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
