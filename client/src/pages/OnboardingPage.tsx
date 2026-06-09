import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import OnboardingForm from '@/modules/auth/components/OnboardingForm'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-16 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-2xl flex flex-col gap-12"
      >
        <Link to="/" className="flex items-center gap-3 w-fit">
          <img src="/logo.webp" alt="Strawby" className="w-12 h-12 object-contain" />
          <span className="text-neutral-900 dark:text-neutral-100 text-[24px] font-black tracking-tighter transition-colors duration-300">
            Strawby
          </span>
        </Link>

        <OnboardingForm />
      </motion.div>
    </div>
  )
}
