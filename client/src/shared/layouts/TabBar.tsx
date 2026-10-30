import { Link, useLocation } from 'react-router-dom'
import { LayoutGroup, motion } from 'framer-motion'
import { ChartColumn, CircleUser, ClipboardList, House, Trophy, Users } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const patientTabs = [
  { label: 'Início', href: '/app/home', icon: House, tourId: 'nav-home' },
  { label: 'Pontuação', href: '/app/score', icon: Trophy, tourId: 'nav-score' },
  { label: 'Plano', href: '/app/plan', icon: ClipboardList, tourId: 'nav-plan' },
  { label: 'Perfil', href: '/app/profile', icon: CircleUser, tourId: 'nav-profile' },
]

const nutritionistTabs = [
  { label: 'Pacientes', href: '/app/home', icon: Users, tourId: undefined },
  { label: 'Resultados', href: '/app/nutritionist/results', icon: ChartColumn, tourId: 'nav-reports' },
  { label: 'Perfil', href: '/app/profile', icon: CircleUser, tourId: 'nav-profile' },
]

const spring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } as const

interface TabBarProps {
  hidden?: boolean
}

export default function TabBar({ hidden = false }: TabBarProps) {
  const { pathname } = useLocation()
  const { data: user } = useAuth()

  const tabs = user?.role === 'nutritionist' ? nutritionistTabs : patientTabs
  const cols = tabs.length === 2 ? 'grid-cols-2' : tabs.length === 3 ? 'grid-cols-3' : tabs.length === 4 ? 'grid-cols-4' : 'grid-cols-5'
  const visibility = hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'

  return (
    <>
      {/* Mobile — barra fixa na borda inferior */}
      <nav
        className={`fixed bottom-0 inset-x-0 sm:hidden z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 transition-opacity duration-200 ${visibility}`}
      >
        <LayoutGroup id="bottom-nav">
          <div className={`grid ${cols} pb-4`}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  {...(tab.tourId ? { 'data-tour': tab.tourId } : {})}
                  className="relative flex flex-col items-center justify-center gap-1 pt-3 pb-1 min-w-0"
                >
                  {active && (
                    <motion.span
                      layoutId="bottom-indicator"
                      initial={false}
                      transition={spring}
                      className="absolute top-0 inset-x-4 h-0.75 bg-red-600 rounded-full"
                    />
                  )}
                  <Icon
                    size={26}
                    strokeWidth={active ? 2.6 : 1.9}
                    className={`shrink-0 transition-colors duration-200 ${active ? 'text-red-600' : 'text-neutral-400 dark:text-neutral-500'}`}
                  />
                  <span className={`text-xs font-bold tracking-tight transition-colors duration-200 ${active ? 'text-red-600' : 'text-neutral-400 dark:text-neutral-500'}`}>
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </LayoutGroup>
      </nav>

      {/* Desktop — pill flutuante centralizada */}
      <nav
        className={`hidden sm:flex fixed bottom-6 lg:bottom-8 inset-x-0 justify-center pointer-events-none z-50 transition-opacity duration-200 ${visibility}`}
      >
        <LayoutGroup id="pill-nav">
          <div className={`${hidden ? 'pointer-events-none' : 'pointer-events-auto'} flex items-center gap-1 p-1.5 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl shadow-lg shadow-neutral-900/10 dark:shadow-black/50`}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  {...(tab.tourId ? { 'data-tour': tab.tourId } : {})}
                  className={`group relative flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full transition-colors duration-200 ${
                    active ? '' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pill-indicator"
                      initial={false}
                      transition={spring}
                      className="absolute inset-0 rounded-full bg-red-50 dark:bg-red-950/50"
                    />
                  )}
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.6 : 1.9}
                    className={`relative shrink-0 transition-colors duration-200 ${
                      active
                        ? 'text-red-600'
                        : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'
                    }`}
                  />
                  <span
                    className={`relative text-sm font-extrabold tracking-tight transition-colors duration-200 ${
                      active
                        ? 'text-red-600'
                        : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </LayoutGroup>
      </nav>
    </>
  )
}
