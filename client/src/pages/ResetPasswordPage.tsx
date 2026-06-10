import { motion } from 'framer-motion'
import ResetPasswordForm from '@/modules/auth/components/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-16 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-5xl flex flex-col gap-24"
      >
        <div className="flex items-center gap-3">
          <img src="/logo.webp" alt="Strawby" className="w-14 h-14 object-contain" />
          <span className="text-neutral-900 dark:text-neutral-100 text-[28px] font-black tracking-tighter transition-colors duration-300">
            Strawby
          </span>
        </div>

        <ResetPasswordForm />
      </motion.div>
    </div>
  )
}
