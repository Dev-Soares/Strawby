import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import DailySummary from '../modules/home/components/DailySummary'
import MealList from '../modules/home/components/MealList'
import WeeklyReport from '../modules/home/components/WeeklyReport'
import type { DailySummary as DailySummaryType } from '../modules/home/types/dailySummary'
import type { Meal } from '../modules/home/types/meal'
import type { WeeklyReportData } from '../modules/home/types/weeklyReport'

const summary: DailySummaryType = {
  macros: [
    { label: 'CALORIAS', value: 1310, max: 2200, unit: 'kcal', color: '#dc2626', trackColor: '#fee2e2' },
    { label: 'PROTEÍNA', value: 82, max: 150, unit: 'g', color: '#f59e0b', trackColor: '#fef3c7' },
    { label: 'CARBOS', value: 145, max: 280, unit: 'g', color: '#3b82f6', trackColor: '#dbeafe' },
    { label: 'GORDURA', value: 48, max: 73, unit: 'g', color: '#a855f7', trackColor: '#f3e8ff' },
  ],
}

const meals: Meal[] = [
  { id: '1', name: 'Café da manhã', mealType: 'breakfast', foods: ['Ovos mexidos', 'Pão integral', 'Café'], time: '07:30', kcal: 420 },
  { id: '2', name: 'Almoço', mealType: 'lunch', foods: ['Frango grelhado', 'Arroz', 'Feijão', 'Salada'], time: '12:15', kcal: 680 },
  { id: '3', name: 'Lanche', mealType: 'snack', foods: ['Banana', 'Mix de castanhas'], time: '15:30', kcal: 210 },
  { id: '4', name: 'Jantar', mealType: 'dinner', foods: ['Salmão grelhado', 'Brócolis', 'Quinoa'], time: '19:45', kcal: 520 },
]

const userName = 'Bernardo'

const weekly: WeeklyReportData = {
  days: [
    { day: 'S', date: 5, status: 'good', kcal: 2100, goal: 2200 },
    { day: 'T', date: 6, status: 'good', kcal: 2150, goal: 2200 },
    { day: 'Q', date: 7, status: 'bad', kcal: 2600, goal: 2200 },
    { day: 'Q', date: 8, status: 'good', kcal: 2050, goal: 2200 },
    { day: 'S', date: 9, status: 'neutral', kcal: 0, goal: 2200 },
    { day: 'S', date: 10, status: 'neutral', kcal: 0, goal: 2200 },
    { day: 'D', date: 11, status: 'neutral', kcal: 0, goal: 2200 },
  ],
  streak: 2,
  bestStreak: 4,
  weekTotalKcal: 8300,
  weekGoalKcal: 11000,
}

export default function MainPage() {
  return (
    <AppLayout>
      <div className="px-6 sm:px-10 lg:px-16 py-10 sm:py-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-neutral-50 to-neutral-50 min-h-screen">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            }).replace(/^\w/, (c) => c.toUpperCase())}
          </p>
          <p
            className="text-4xl sm:text-5xl font-black text-neutral-950 leading-tight tracking-tight mb-2"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Olá, {userName}
          </p>
          <h1
            className="text-xl sm:text-2xl font-black text-neutral-950 leading-tight tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Vamos cuidar da sua{' '}
            <span className="text-red-600">alimentação</span>?
          </h1>
        </motion.div>

        <div className="space-y-5">
          <WeeklyReport data={weekly} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <DailySummary data={summary} />
            <MealList meals={meals} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
