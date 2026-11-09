import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

const ease = [0.4, 0, 0.2, 1] as const

/**
 * Nav flutuante: nasce larga e transparente sobre a hero e, ao rolar,
 * encolhe numa pílula sólida com sombra.
 */
export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5">
      <motion.nav
        className="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full border-2 px-3 py-2 backdrop-blur-xl sm:gap-6 sm:px-4 sm:py-2.5"
        initial={false}
        animate={{
          maxWidth: scrolled ? 760 : 1088,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0)',
          borderColor: scrolled ? 'rgba(231,229,228,1)' : 'rgba(231,229,228,0)',
          boxShadow: scrolled
            ? '0 14px 34px -16px rgba(28,25,23,0.25)'
            : '0 0 0 0 rgba(28,25,23,0)',
        }}
        transition={{ duration: 0.4, ease }}
      >
        <a href="/" className="flex min-w-0 select-none items-center gap-2 pl-1 sm:gap-2.5">
          <motion.img
            draggable={false}
            src="/logo.webp"
            width={128}
            height={128}
            alt="Strawby"
            className="shrink-0 object-contain"
            animate={{ width: scrolled ? 30 : 38, height: scrolled ? 30 : 38 }}
            transition={{ duration: 0.4, ease }}
          />
          <span className="font-display text-lg font-extrabold tracking-tighter text-neutral-950 sm:text-xl">
            Strawby
          </span>
        </a>

        <a
          href="/app/login"
          className="shrink-0 rounded-full bg-red-600 px-5 py-2 text-sm font-bold whitespace-nowrap text-white shadow-sm shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md hover:shadow-red-600/30 active:translate-y-0 active:bg-red-800 sm:px-6 sm:py-2.5 sm:text-[15px]"
        >
          Entrar
        </a>
      </motion.nav>
    </header>
  )
}
