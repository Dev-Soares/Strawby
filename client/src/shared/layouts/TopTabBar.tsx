import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HouseSimpleIcon,
  TrophyIcon,
  TargetIcon,
  CarrotIcon,
  UserCircleIcon,
  UsersIcon,
  ChartBarIcon,
} from '@phosphor-icons/react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const patientTabs = [
  { label: 'Início', href: '/app/home', icon: HouseSimpleIcon, tourId: 'nav-home' },
  { label: 'Pontuação', href: '/app/score', icon: TrophyIcon, tourId: 'nav-score' },
  { label: 'Alimentos', href: '/app/foods', icon: CarrotIcon, tourId: undefined },
  { label: 'Plano', href: '/app/plan', icon: TargetIcon, tourId: 'nav-plan' },
  { label: 'Perfil', href: '/app/profile', icon: UserCircleIcon, tourId: 'nav-profile' },
]

const nutritionistTabs = [
  { label: 'Pacientes', href: '/app/home', icon: UsersIcon, tourId: undefined },
  { label: 'Relatórios', href: '/app/nutritionist/reports', icon: ChartBarIcon, tourId: 'nav-reports' },
  { label: 'Perfil', href: '/app/profile', icon: UserCircleIcon, tourId: 'nav-profile' },
]

const INDICATOR_INSET = 12

interface TopTabBarProps {
  hidden?: boolean
  variant?: 'top' | 'bottom'
}

export default function TopTabBar({ hidden = false, variant = 'top' }: TopTabBarProps) {
  const { pathname } = useLocation()
  const { data: user } = useAuth()

  const tabs = user?.role === 'nutritionist' ? nutritionistTabs : patientTabs
  const cols = tabs.length === 2 ? 'grid-cols-2' : tabs.length === 3 ? 'grid-cols-3' : 'grid-cols-5'
  const activeIndex = tabs.findIndex((t) => pathname === t.href)
  const tabWidthPct = 100 / tabs.length

  if (variant === 'bottom') {
    return (
      <nav
        className={`fixed bottom-0 inset-x-0 sm:hidden z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 transition-opacity duration-200 ${
          hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className={`grid ${cols} pb-4 relative`}>
          {activeIndex >= 0 && (
            <motion.span
              className="absolute top-0 h-0.5 bg-red-600 rounded-full pointer-events-none"
              initial={false}
              animate={{
                left: `calc(${activeIndex * tabWidthPct}% + ${INDICATOR_INSET}px)`,
                width: `calc(${tabWidthPct}% - ${INDICATOR_INSET * 2}px)`,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                to={tab.href}
                {...(tab.tourId ? { 'data-tour': tab.tourId } : {})}
                className="flex flex-col items-center justify-center gap-1 pt-3 pb-1 min-w-0"
              >
                <Icon
                  size={22}
                  weight={active ? 'fill' : 'regular'}
                  className={`shrink-0 transition-colors ${active ? 'text-red-600' : 'text-neutral-400 dark:text-neutral-500'}`}
                />
                <span className={`text-[10px] font-bold tracking-tight transition-colors ${active ? 'text-red-600' : 'text-neutral-400 dark:text-neutral-500'}`}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <nav
      className={`transition-opacity duration-200 ${hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="px-4 sm:px-10 lg:px-16">
        <div className={`grid ${cols} sm:flex sm:items-center sm:gap-2`}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                to={tab.href}
                {...(tab.tourId ? { 'data-tour': tab.tourId } : {})}
                className="group relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 min-w-0"
              >
                <Icon
                  size={18}
                  weight={active ? 'fill' : 'regular'}
                  className={`shrink-0 transition-colors ${
                    active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                  }`}
                />
                <span className={`text-[11px] sm:text-sm font-extrabold tracking-tight transition-colors max-w-full ${
                  active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'
                }`}>
                  {tab.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="tab-indicator-top"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute left-3 right-3 sm:left-2 sm:right-2 -bottom-px h-0.5 bg-red-600 rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
