import { CaretLeft, CaretRight, BookOpen, Fire } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetPatientDailyMeals } from '../hooks/useGetPatientDailyMeals'
import PatientDiarySkeleton from '../skeletons/PatientDiarySkeleton'
import { getPatientMealType } from '../config/patientMealTypes'
type Plan = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

type Props = {
  patientId: string
  selectedDay: string
  plan?: Plan | null
  onPrevDay: () => void
  onNextDay: () => void
  isToday: boolean
}

export default function PatientDiarySection({ patientId, selectedDay, plan, onPrevDay, onNextDay, isToday }: Props) {
  const { data: meals, isPending } = useGetPatientDailyMeals(patientId, selectedDay)

  const totals = meals?.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totals.calories,
      protein: acc.protein + meal.totals.protein,
      carbs: acc.carbs + meal.totals.carbs,
      fat: acc.fat + meal.totals.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  const formatDay = (iso: string) => {
    const [year, month, day] = iso.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
      .replace(/^\w/, (c) => c.toUpperCase())
  }

  const pct = (actual: number, goal: number) =>
    goal > 0 ? Math.min(Math.round((actual / goal) * 100), 100) : 0

  const macros = [
    { label: 'Proteína', actual: Math.round(totals?.protein ?? 0), goal: plan?.protein, color: '#f59e0b', track: '#fef3c7' },
    { label: 'Carboidratos', actual: Math.round(totals?.carbs ?? 0), goal: plan?.carbs, color: '#3b82f6', track: '#dbeafe' },
    { label: 'Gordura', actual: Math.round(totals?.fat ?? 0), goal: plan?.fat, color: '#a855f7', track: '#f3e8ff' },
  ]

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <BookOpen size={18} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <h2 className="text-xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Diário alimentar</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevDay}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <CaretLeft size={15} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
          </button>
          <div className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 min-w-36 text-center">
            <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {isToday ? 'Hoje' : formatDay(selectedDay).split(',')[0]}
              {' '}
              <span className="text-neutral-400 dark:text-neutral-500 font-medium">
                {selectedDay.split('-').slice(2, 3)[0]}/{selectedDay.split('-')[1]}
              </span>
            </span>
          </div>
          <button
            onClick={onNextDay}
            disabled={isToday}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CaretRight size={15} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>
      </div>

      {isPending ? (
        <PatientDiarySkeleton />
      ) : !meals || meals.length === 0 ? (
        <div className="flex flex-col items-center text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl">
          <BookOpen size={28} weight="light" className="text-neutral-300 dark:text-neutral-600 mb-3" />
          <p className="text-base font-bold text-neutral-500 dark:text-neutral-400">Nenhuma refeição registrada</p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">O paciente não registrou refeições neste dia</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Totals summary */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Fire size={16} weight="fill" className="text-red-500" />
                <span className="text-sm font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Total do dia</span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums">
                  {Math.round(totals?.calories ?? 0).toLocaleString('pt-BR')}
                </span>
                <span className="text-lg font-semibold text-neutral-400">kcal</span>
                {plan && (
                  <span className="text-base font-bold text-neutral-400 dark:text-neutral-500">
                    / {plan.calories.toLocaleString('pt-BR')} meta
                  </span>
                )}
              </div>

              {plan && (
                <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct(totals?.calories ?? 0, plan.calories)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {macros.map((m) => (
                  <div key={m.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: m.color }}>{m.label}</span>
                      <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                        {m.actual}g{m.goal ? ` / ${m.goal}g` : ''}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: m.track }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                        initial={{ width: 0 }}
                        animate={{ width: m.goal ? `${pct(m.actual, m.goal)}%` : '0%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meals.map((meal, i) => {
                const cfg = getPatientMealType(meal.mealType)
                const MealIcon = cfg.Icon
                const allItems = [
                  ...meal.items.map((item) => item.food?.name ?? item.privateFood?.name ?? 'Item'),
                  ...meal.recipes.map((r) => r.name),
                ]
                return (
                  <motion.div
                    key={meal.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-5 shadow-sm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cfg.color}20` }}
                      >
                        <MealIcon size={20} weight="bold" style={{ color: cfg.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-extrabold truncate" style={{ color: cfg.color }}>{meal.name}</p>
                        {meal.time && (
                          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">{meal.time}</p>
                        )}
                      </div>
                      <div className="ml-auto text-right shrink-0">
                        <p className="text-lg font-extrabold tabular-nums" style={{ color: cfg.color }}>
                          {Math.round(meal.totals.calories)}
                        </p>
                        <p className="text-xs font-semibold text-neutral-400">kcal</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        { l: 'Prot', v: Math.round(meal.totals.protein) },
                        { l: 'Carb', v: Math.round(meal.totals.carbs) },
                        { l: 'Gord', v: Math.round(meal.totals.fat) },
                      ].map(({ l, v }) => (
                        <span
                          key={l}
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                        >
                          {v}g {l}
                        </span>
                      ))}
                    </div>

                    {allItems.length > 0 && (
                      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">
                          Alimentos
                        </p>
                        <ul className="flex flex-col gap-1">
                          {allItems.slice(0, 4).map((name, idx) => (
                            <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                              · {name}
                            </li>
                          ))}
                          {allItems.length > 4 && (
                            <li className="text-sm text-neutral-400 dark:text-neutral-500">
                              +{allItems.length - 4} mais
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  )
}
