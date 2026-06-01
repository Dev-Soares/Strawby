import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface BlobMenuProps {
  isOpen: boolean
  onClose: () => void
}

const blobPath = 'M 24 0 C 8 8, 0 22, 2 38 C 4 54, 22 58, 20 70 C 16 82, 6 86, 10 94 C 12 98, 16 100, 22 100 L 100 100 L 100 0 Z'

const patientNavItems = [
  { label: 'Início', href: '/app/home' },
  { label: 'Pontuação', href: '/app/score' },
  { label: 'Plano', href: '/app/plan' },
  { label: 'Perfil', href: '/app/profile' },
]

const nutritionistNavItems = [
  { label: 'Pacientes', href: '/app/home' },
  { label: 'Relatórios', href: '/app/nutritionist/reports' },
  { label: 'Perfil', href: '/app/profile' },
]

export default function BlobMenu({ isOpen, onClose }: BlobMenuProps) {
  const { pathname } = useLocation()
  const { mutate: signOut, isPending: isSigningOut } = useSignOut()
  const { data: user } = useAuth()

  const navItems = user?.role === 'nutritionist' ? nutritionistNavItems : patientNavItems

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-65 overflow-hidden"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          style={{ willChange: 'transform', touchAction: 'none' }}
          onClick={onClose}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={blobPath} fill="#dc2626" />
            </svg>
          </div>

          <div
            className="absolute inset-0 flex flex-col justify-start pt-28 sm:justify-center sm:pt-0 pl-[28%] sm:pl-[24%] md:pl-[28%] lg:pl-[32%] pr-8 sm:pr-10 md:pr-16 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
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
                      className="group flex items-center gap-4 py-5 sm:py-6"
                    >
                      <span
                        className={`font-extrabold text-[46px] sm:text-[50px] lg:text-[62px] leading-none tracking-tight text-white transition-all duration-300 ease-out group-hover:translate-x-2 ${
                          isActive ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
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

            <motion.div
              className="flex flex-col sm:flex-row items-end sm:items-center justify-start sm:justify-end gap-3 mt-6 md:mt-10 pointer-events-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <button
                type="button"
                onClick={() => signOut()}
                disabled={isSigningOut}
                className="group bg-white/95 backdrop-blur-sm border border-white/20 text-red-600 hover:bg-white hover:border-white/40 text-sm sm:text-base font-extrabold px-10 sm:px-9 py-4 sm:py-4.5 rounded-full transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap shadow-lg hover:shadow-2xl hover:-translate-y-1 tracking-tight disabled:opacity-50 cursor-pointer"
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
