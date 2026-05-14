import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'

interface BlobMenuProps {
  isOpen: boolean
  onClose: () => void
}

const blobPath = 'M 24 0 C 8 8, 0 22, 2 38 C 4 54, 22 58, 20 70 C 16 82, 6 86, 10 94 C 12 98, 16 100, 22 100 L 100 100 L 100 0 Z'

const navItems = [
  { label: 'Início', href: '/home' },
  { label: 'Pontuação', href: '/score' },
  { label: 'Plano', href: '/plan' },
]

export default function BlobMenu({ isOpen, onClose }: BlobMenuProps) {
  const { pathname } = useLocation()
  const { mutate: signOut, isPending: isSigningOut } = useSignOut()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-65 overflow-hidden"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          onClick={onClose}
        >
          {/* Red blob — fills right area, organic left edge, transparent outside */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={blobPath} fill="#dc2626" />
          </svg>

          {/* Content — positioned inside red zone */}
          <div
            className="absolute inset-0 flex flex-col justify-between md:justify-center pl-[14%] sm:pl-[18%] md:pl-[22%] pr-6 sm:pr-10 md:pr-16 pt-20 sm:pt-24 md:pt-0 pb-8 md:pb-0 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nav items */}
            <nav className="flex flex-col pointer-events-auto">
              {navItems.map((item, i) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.href}
                    className="border-b border-white/20 first:border-t first:border-white/20"
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.07, ease: [0.34, 1.05, 0.64, 1] }}
                  >
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-3.5 sm:py-6"
                    >
                      <span
                        className={`font-extrabold text-[32px] sm:text-[50px] lg:text-[62px] leading-none tracking-tight transition-all duration-200 group-hover:translate-x-2 ${
                          isActive ? 'text-white' : 'text-white/85 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                      <ArrowRight
                        size={20}
                        weight="bold"
                        className="ml-auto text-white opacity-0 -translate-x-3 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 shrink-0"
                      />
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom CTA */}
            <motion.div
              className="flex justify-end mt-6 md:mt-10 pointer-events-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <button
                type="button"
                onClick={() => signOut()}
                disabled={isSigningOut}
                className="group bg-white text-red-600 hover:bg-neutral-950 hover:text-white text-sm sm:text-base font-extrabold px-7 sm:px-9 py-3.5 sm:py-4.5 rounded-full transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 hover:scale-[1.03] tracking-tight disabled:opacity-50 cursor-pointer"
              >
                {isSigningOut ? 'Saindo…' : 'Sair da conta'}
                <ArrowRight size={17} weight="bold" className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
