import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import DailyScoreDashboard from '../modules/daily-score/components/DailyScoreDashboard'

export default function ScorePage() {
  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8 sm:py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
            Pontuação
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 transition-colors duration-300">
            Minha consistência dia a dia
          </p>
        </motion.div>

        <DailyScoreDashboard />
      </div>
    </AppLayout>
  )
}
