import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import LoginForm from '@/modules/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-8 lg:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-5xl flex flex-col gap-24"
      >
        {/* Botão voltar + Logo */}
        <div className="flex flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white font-semibold px-5 py-3 rounded-full text-[14px] transition-colors duration-200 cursor-pointer w-fit"
          >
            <ArrowLeft size={16} weight="bold" />
            Voltar
          </Link>

          <Link to="/" className="flex items-center gap-3 w-fit">
            <img src="/logo.png" alt="Strawby" className="w-14 h-14 object-contain" />
            <span className="text-neutral-900 text-[28px] font-black tracking-tighter">
              Strawby
            </span>
          </Link>
        </div>

        <LoginForm />
      </motion.div>
    </div>
  )
}
