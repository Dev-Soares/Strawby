import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHidden(latest > 80)
  })

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-20 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-center h-16 sm:h-18 md:h-20 px-4 sm:px-6 md:px-10 transition-colors duration-300"
      animate={hidden ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-5xl flex items-center justify-between">

        <a href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src="/logo.webp" alt="Strawby" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain shrink-0" />
           <span className="font-display text-neutral-950 dark:text-neutral-100 text-lg sm:text-xl md:text-2xl tracking-tighter font-extrabold transition-colors duration-300">
            Strawby
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 ml-4">
          <a
            href="/app/login"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 font-semibold text-sm sm:text-base px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 whitespace-nowrap"
          >
            Entrar
          </a>
          <a
            href="/app/create-account"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm sm:text-base px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-150 whitespace-nowrap"
          >
            Criar conta
          </a>
        </div>

      </div>
    </motion.header>
  )
}
