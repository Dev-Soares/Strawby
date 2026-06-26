import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, HouseSimple, Carrot, Gear, Users, UserCircle } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/modules/auth/hooks/useAuth'

interface BlobMenuProps {
  isOpen: boolean
  onClose: () => void
}

const blobPath = 'M 24 0 C 8 8, 0 22, 2 38 C 4 54, 22 58, 20 70 C 16 82, 6 86, 10 94 C 12 98, 16 100, 22 100 L 100 100 L 100 0 Z'

const patientNavItems: { label: string; href: string; icon: Icon }[] = [
  { label: 'Início', href: '/app/home', icon: HouseSimple },
  { label: 'Alimentos', href: '/app/foods', icon: Carrot },
  { label: 'Ajustes', href: '/app/settings', icon: Gear },
]

const nutritionistNavItems: { label: string; href: string; icon: Icon }[] = [
  { label: 'Pacientes', href: '/app/home', icon: Users },
  { label: 'Perfil', href: '/app/profile', icon: UserCircle },
  { label: 'Ajustes', href: '/app/settings', icon: Gear },
]

export default function BlobMenu({ isOpen, onClose }: BlobMenuProps) {
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
            className="absolute inset-0 flex flex-col justify-between pt-28 pb-12 sm:justify-center sm:pt-0 sm:pb-0 pl-[20%] sm:pl-[24%] md:pl-[28%] lg:pl-[32%] sm:pr-10 md:pr-16 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col pointer-events-auto">
              {navItems.map((item, i) => {
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
                      <item.icon
                        size={38}
                        weight="fill"
                        className="shrink-0 text-white transition-all duration-300 ease-out group-hover:translate-x-2"
                      />
                      <span
                        className="font-extrabold text-[48px] sm:text-[60px] lg:text-[72px] leading-none tracking-tight text-white transition-all duration-300 ease-out group-hover:translate-x-2 pr-4"
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

            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
