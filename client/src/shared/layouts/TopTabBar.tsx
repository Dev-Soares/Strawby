import { Link, useLocation } from 'react-router-dom'
import {
  HouseSimpleIcon,
  TrophyIcon,
  TargetIcon,
} from '@phosphor-icons/react'

const tabs = [
  { label: 'Início', href: '/home', icon: HouseSimpleIcon },
  { label: 'Pontuação', href: '/score', icon: TrophyIcon },
  { label: 'Plano', href: '/plan', icon: TargetIcon },
]

interface TopTabBarProps {
  hidden?: boolean
}

export default function TopTabBar({ hidden = false }: TopTabBarProps) {
  const { pathname } = useLocation()

  return (
    <nav
      className={`transition-opacity duration-200 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="px-2 sm:px-10 lg:px-16">
        <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className="group relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3.5 min-w-0"
              >
                <Icon
                  size={18}
                  weight={active ? 'fill' : 'regular'}
                  className={`shrink-0 transition-colors ${
                    active ? 'text-red-600' : 'text-neutral-500 group-hover:text-neutral-800'
                  }`}
                />
                <span
                  className={`text-[11px] sm:text-sm font-extrabold tracking-tight transition-colors truncate max-w-full ${
                    active ? 'text-red-600' : 'text-neutral-500 group-hover:text-neutral-900'
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
