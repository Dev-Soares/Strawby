import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from '@phosphor-icons/react'
import { Coffee, ForkKnife, Leaf, Moon, Cookie, CaretDown } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface Food {
  name: string
  grams: number
  kcal: number
}

interface MealPlan {
  id: string
  icon: Icon
  label: string
  name: string
  kcal: number
  protein: number
  carbs: number
  fat: number
  accent: string
  accentLight: string
  accentText: string
  foods: Food[]
}

const meals: MealPlan[] = [
  {
    id: 'breakfast',
    icon: Coffee,
    label: 'MANHÃ',
    name: 'Café da manhã',
    kcal: 480,
    protein: 32,
    carbs: 58,
    fat: 14,
    accent: '#ea580c',
    accentLight: '#fed7aa',
    accentText: '#c2410c',
    foods: [
      { name: 'Aveia em flocos', grams: 80, kcal: 292 },
      { name: 'Ovo mexido', grams: 120, kcal: 186 },
      { name: 'Banana prata', grams: 100, kcal: 89 },
      { name: 'Whey protein', grams: 30, kcal: 120 },
    ],
  },
  {
    id: 'lunch',
    icon: ForkKnife,
    label: 'ALMOÇO',
    name: 'Almoço',
    kcal: 720,
    protein: 52,
    carbs: 88,
    fat: 18,
    accent: '#16a34a',
    accentLight: '#bbf7d0',
    accentText: '#15803d',
    foods: [
      { name: 'Arroz branco cozido', grams: 200, kcal: 260 },
      { name: 'Feijão preto cozido', grams: 150, kcal: 171 },
      { name: 'Frango grelhado', grams: 180, kcal: 243 },
      { name: 'Salada mista', grams: 100, kcal: 28 },
      { name: 'Azeite de oliva', grams: 10, kcal: 88 },
    ],
  },
  {
    id: 'snack',
    icon: Leaf,
    label: 'LANCHE',
    name: 'Lanche da tarde',
    kcal: 260,
    protein: 18,
    carbs: 28,
    fat: 9,
    accent: '#2563eb',
    accentLight: '#bfdbfe',
    accentText: '#1d4ed8',
    foods: [
      { name: 'Iogurte grego natural', grams: 170, kcal: 146 },
      { name: 'Maçã fuji', grams: 180, kcal: 93 },
      { name: 'Castanha do Pará', grams: 30, kcal: 196 },
    ],
  },
  {
    id: 'dinner',
    icon: Moon,
    label: 'JANTAR',
    name: 'Jantar',
    kcal: 580,
    protein: 44,
    carbs: 62,
    fat: 16,
    accent: '#9333ea',
    accentLight: '#e9d5ff',
    accentText: '#7e22ce',
    foods: [
      { name: 'Tilápia grelhada', grams: 200, kcal: 218 },
      { name: 'Batata doce cozida', grams: 150, kcal: 135 },
      { name: 'Brócolis no vapor', grams: 150, kcal: 51 },
      { name: 'Azeite de oliva', grams: 8, kcal: 71 },
    ],
  },
  {
    id: 'supper',
    icon: Cookie,
    label: 'CEIA',
    name: 'Ceia',
    kcal: 160,
    protein: 24,
    carbs: 12,
    fat: 3,
    accent: '#475569',
    accentLight: '#cbd5e1',
    accentText: '#334155',
    foods: [
      { name: 'Whey protein', grams: 30, kcal: 120 },
      { name: 'Cottage light', grams: 100, kcal: 98 },
      { name: 'Morango', grams: 100, kcal: 32 },
    ],
  },
]

export default function PlanMealsSection() {
  const [openId, setOpenId] = useState<string | null>(null)
  const navigate = useNavigate()
  const totalKcal = meals.reduce((a, m) => a + m.kcal, 0)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div className="px-10 sm:px-16 pb-32">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-none">
            Refeições
          </h2>
          <p className="text-sm text-neutral-500 mt-1.5">Distribuição do seu plano ao longo do dia</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-500 tabular-nums hidden sm:block">
            {meals.length} refeições · {totalKcal.toLocaleString('pt-BR')} kcal total
          </span>
          <button
            onClick={() => navigate('/meals/new')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer shrink-0"
          >
            <Plus size={15} weight="bold" />
            Nova refeição
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
        {meals.map((meal, index) => {
          const MealIcon = meal.icon
          const pct = Math.round((meal.kcal / totalKcal) * 100)
          const isOpen = openId === meal.id
          const isLastOdd = index === meals.length - 1 && meals.length % 3 === 1

          return (
            <div
              key={meal.id}
              className={`bg-white border border-neutral-200 shadow-sm rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md ${isLastOdd ? 'xl:col-span-3' : meals.length % 3 === 2 && index === meals.length - 1 ? 'md:col-span-2 xl:col-span-1 xl:col-start-2' : ''}`}
            >
              {/* Card body */}
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: meal.accentLight }}
                  >
                    <MealIcon size={18} weight="bold" style={{ color: meal.accentText }} />
                  </div>
                  <span
                    className="text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: meal.accentLight, color: meal.accentText }}
                  >
                    {meal.label}
                  </span>
                </div>

                {/* Kcal */}
                <div className="mb-1">
                  <span
                    className="font-display text-5xl font-extrabold leading-none tabular-nums"
                    style={{ color: meal.accent }}
                  >
                    {meal.kcal}
                  </span>
                  <span className="text-lg font-bold text-neutral-400 ml-2">kcal</span>
                </div>
                <p
                  className="font-display text-base font-bold mb-0.5"
                  style={{ color: meal.accentText }}
                >
                  {meal.name}
                </p>
                <p className="text-sm font-semibold text-neutral-500 mb-4">{pct}% do total diário</p>

                {/* Macro chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { l: 'Proteína', v: meal.protein },
                    { l: 'Carbos', v: meal.carbs },
                    { l: 'Gordura', v: meal.fat },
                  ].map(({ l, v }) => (
                    <span
                      key={l}
                      className="text-sm font-bold px-3 py-1.5 rounded-full tabular-nums"
                      style={{ backgroundColor: meal.accentLight, color: meal.accentText }}
                    >
                      {v}g {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dropdown trigger */}
              <button
                type="button"
                onClick={() => toggle(meal.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 border-t border-neutral-100 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
                style={{ color: meal.accentText }}
              >
                <span className="text-sm font-bold">
                  {meal.foods.length} alimentos
                </span>
                <CaretDown
                  size={16}
                  weight="bold"
                  className="transition-transform duration-250"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* Food list — animated */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-neutral-100 divide-y divide-neutral-50">
                      {meal.foods.map((food) => (
                        <div key={food.name} className="flex items-center justify-between px-5 py-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-neutral-800 truncate">{food.name}</p>
                            <p className="text-xs font-medium text-neutral-500 mt-0.5">{food.grams}g</p>
                          </div>
                          <span
                            className="text-sm font-extrabold tabular-nums shrink-0 ml-4"
                            style={{ color: meal.accent }}
                          >
                            {food.kcal} kcal
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
