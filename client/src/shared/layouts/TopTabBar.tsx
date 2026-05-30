import { Link, useLocation } from 'react-router-dom'
import {
  HouseSimpleIcon,
  TrophyIcon,
  TargetIcon,
  CarrotIcon,
  UserCircleIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

const patientTabs = [
  { label: 'Início', href: '/app/home', icon: HouseSimpleIcon },
  { label: 'Pontuação', href: '/app/score', icon: TrophyIcon },
  { label: 'Alimentos', href: '/app/foods', icon: CarrotIcon },
  { label: 'Plano', href: '/app/plan', icon: TargetIcon },
  { label: 'Perfil', href: '/app/profile', icon: UserCircleIcon },
]

const nutritionistTabs = [
  { label: 'Pacientes', href: '/app/home', icon: UsersIcon },
  { label: 'Perfil', href: '/app/profile', icon: UserCircleIcon },
]

interface TopTabBarProps {
  hidden?: boolean
}

export default function TopTabBar({ hidden = false }: TopTabBarProps) {
  const { pathname } = useLocation()
  const { data: user } = useAuth()

  const tabs = user?.role === 'nutritionist' ? nutritionistTabs : patientTabs
  const cols = tabs.length === 2 ? 'grid-cols-2' : 'grid-cols-5'

  return (
    <nav
      className={`transition-opacity duration-200 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
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
                className="group relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 min-w-0"
              >
                <Icon
                  size={18}
                  weight={active ? 'fill' : 'regular'}
                  className={`shrink-0 transition-colors ${
                    active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                  }`}
                />
                <span
                  className={`text-[11px] sm:text-sm font-extrabold tracking-tight transition-colors max-w-full ${
                    active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'
                  }`}
                >
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute left-3 right-3 sm:left-2 sm:right-2 -bottom-px h-0.5 bg-red-600 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
