import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import DailySummary from '../modules/home/components/DailySummary'
import MealList from '../modules/home/components/MealList'
import type { DailySummary as DailySummaryType } from '../modules/home/types/dailySummary'
import type { Meal } from '../modules/home/types/meal'

const summary: DailySummaryType = {
  macros: [
    { label: 'CALORIAS', value: 1310, max: 2200, unit: 'kcal', color: '#dc2626', trackColor: '#fee2e2' },
    { label: 'PROTEÍNA', value: 82, max: 150, unit: 'g', color: '#f59e0b', trackColor: '#fef3c7' },
    { label: 'CARBOS', value: 145, max: 280, unit: 'g', color: '#3b82f6', trackColor: '#dbeafe' },
    { label: 'GORDURA', value: 48, max: 73, unit: 'g', color: '#a855f7', trackColor: '#f3e8ff' },
  ],
}

const meals: Meal[] = [
  {
    id: '1',
    name: 'Café da manhã',
    mealType: 'breakfast',
    time: '07:30',
    kcal: 420,
    foods: [
      { name: 'Ovos mexidos', grams: 120, kcal: 186, protein: 13, carbs: 1, fat: 14 },
      { name: 'Pão integral', grams: 60, kcal: 158, protein: 6, carbs: 28, fat: 2 },
      { name: 'Café', grams: 200, kcal: 76, protein: 1, carbs: 16, fat: 0 },
    ],
  },
  {
    id: '2',
    name: 'Almoço',
    mealType: 'lunch',
    time: '12:15',
    kcal: 680,
    foods: [
      { name: 'Frango grelhado', grams: 180, kcal: 243, protein: 42, carbs: 0, fat: 8 },
      { name: 'Arroz branco', grams: 150, kcal: 195, protein: 4, carbs: 42, fat: 1 },
      { name: 'Feijão preto', grams: 130, kcal: 148, protein: 10, carbs: 25, fat: 1 },
      { name: 'Salada mista', grams: 100, kcal: 94, protein: 2, carbs: 6, fat: 7 },
    ],
  },
  {
    id: '3',
    name: 'Lanche',
    mealType: 'snack',
    time: '15:30',
    kcal: 210,
    foods: [
      { name: 'Banana prata', grams: 100, kcal: 89, protein: 1, carbs: 23, fat: 0 },
      { name: 'Mix de castanhas', grams: 25, kcal: 121, protein: 4, carbs: 4, fat: 11 },
    ],
  },
  {
    id: '4',
    name: 'Jantar',
    mealType: 'dinner',
    time: '19:45',
    kcal: 520,
    foods: [
      { name: 'Salmão grelhado', grams: 180, kcal: 312, protein: 38, carbs: 0, fat: 18 },
      { name: 'Brócolis no vapor', grams: 150, kcal: 51, protein: 4, carbs: 10, fat: 1 },
      { name: 'Quinoa cozida', grams: 120, kcal: 157, protein: 5, carbs: 28, fat: 3 },
    ],
  },
]

const userName = 'Bernardo'

export default function MainPage() {
  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-50/50 via-neutral-50 to-neutral-50 min-h-screen">
        <motion.div
          className="mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs sm:text-sm font-extrabold text-neutral-500 uppercase tracking-widest mb-3 sm:mb-4">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            }).replace(/^\w/, (c) => c.toUpperCase())}
          </p>
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 leading-tight tracking-tight mb-2">
            Olá, {userName}
          </p>
          <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 leading-tight tracking-tight">
            Vamos cuidar da sua{' '}
            <span className="text-red-600">alimentação</span>?
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
          <DailySummary data={summary} />
          <MealList meals={meals} />
        </div>
      </div>
    </AppLayout>
  )
}
