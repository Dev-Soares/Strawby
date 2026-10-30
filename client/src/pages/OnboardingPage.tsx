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
        <Link to="/" className="flex items-center gap-1 w-fit select-none">
          <img draggable={false} src="/logo.webp" width={128} height={128} alt="Strawby" className="w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0 -ml-2" />
          <span className="text-neutral-900 dark:text-neutral-100 text-[24px] font-black tracking-tighter leading-none translate-y-[0.04em] transition-colors duration-300">
            Strawby
          </span>
        </Link>

        <OnboardingForm />
      </motion.div>
    </div>
  )
}
