import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import WeeklyReport from '../modules/home/components/WeeklyReport'
import WeeklyScore from '../modules/home/components/WeeklyScore'
import type { WeeklyReportData } from '../modules/home/types/weeklyReport'

const weekly: WeeklyReportData = {
  days: [
    { day: 'S', date: 5, status: 'good', kcal: 2100, goal: 2200, score: 95 },
    { day: 'T', date: 6, status: 'warn', kcal: 2150, goal: 2200, score: 88 },
    { day: 'Q', date: 7, status: 'bad', kcal: 2600, goal: 2200, score: 42 },
    { day: 'Q', date: 8, status: 'good', kcal: 2050, goal: 2200, score: 92 },
    { day: 'S', date: 9, status: 'neutral', kcal: 0, goal: 2200 },
    { day: 'S', date: 10, status: 'neutral', kcal: 0, goal: 2200 },
    { day: 'D', date: 11, status: 'neutral', kcal: 0, goal: 2200 },
  ],
  weekScore: 317,
  weekMaxScore: 700,
  level: 4,
  weekTotalKcal: 8300,
  weekGoalKcal: 11000,
}

export default function ScorePage() {
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
            Sua jornada
          </p>
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 leading-tight tracking-tight mb-2">
            Pontuação
          </p>
          <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 leading-tight tracking-tight">
            Acompanhe sua{' '}
            <span className="text-red-600">consistência</span>.
          </h1>
        </motion.div>

        <div className="space-y-4 sm:space-y-5">
          <WeeklyReport data={weekly} />
          <WeeklyScore score={weekly.weekScore} maxScore={weekly.weekMaxScore} />
        </div>
      </div>
    </AppLayout>
  )
}
