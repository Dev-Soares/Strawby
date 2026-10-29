import { motion } from 'framer-motion'
import SignUpForm from '@/modules/auth/components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-10 sm:py-16 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-5xl flex flex-col gap-10 sm:gap-14 lg:gap-16"
      >
        <div className="flex items-center gap-1 select-none">
          <img draggable={false} src="/logo.webp" alt="Strawby" className="w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0 -ml-2" />
          <span className="text-neutral-900 dark:text-neutral-100 text-[24px] sm:text-[28px] font-black tracking-tighter leading-none translate-y-[0.04em] transition-colors duration-300">
            Strawby
          </span>
        </div>

        <SignUpForm />
      </motion.div>
    </div>
  )
}
