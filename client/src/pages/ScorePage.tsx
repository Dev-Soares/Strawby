import { motion } from 'framer-motion'
import AppLayout from '../shared/layouts/AppLayout'
import DailyScoreDashboard from '../modules/daily-score/components/DailyScoreDashboard'

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

        <DailyScoreDashboard />
      </div>
    </AppLayout>
  )
}
