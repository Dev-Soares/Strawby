import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import DailyScoreDashboard from '../modules/daily-score/components/DailyScoreDashboard'

export default function ScorePage() {
  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-10 lg:py-12 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-50/50 via-neutral-50 to-neutral-50 dark:from-amber-950/30 dark:via-neutral-950 dark:to-neutral-950 min-h-screen transition-colors duration-300">
        <motion.div
          className="mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight mb-2 transition-colors duration-300">
            Pontuação
          </p>
          <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight transition-colors duration-300">
            Acompanhe sua{' '}
            <span className="text-red-600">consistência</span>.
          </h1>
        </motion.div>

        <DailyScoreDashboard />
      </div>
    </AppLayout>
  )
}
