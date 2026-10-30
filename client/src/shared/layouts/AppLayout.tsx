import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BlobMenu from './BlobMenu'
import TabBar from './TabBar'
import NotificationPermissionPopup from '@/modules/notifications/components/NotificationPermissionPopup'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className={`sticky top-0 z-70 pt-3 sm:pt-4 transition-colors duration-300 ${menuOpen ? 'bg-transparent' : 'bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md'}`}>
        <header className="flex items-center justify-between px-5 sm:px-8 lg:px-13 xl:px-21 h-14 sm:h-16 md:h-20">
          <Link
            to="/app/home"
            aria-label="Ir para o início"
            className={`group flex items-center gap-1 select-none rounded-xl transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-neutral-950 ${
              menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <img draggable={false} src="/logo.webp" width={128} height={128} alt="" className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0 -ml-1.5 sm:-ml-2 transition-transform duration-200 group-hover:-rotate-6 group-active:scale-95" />
            <span className="font-display text-neutral-950 dark:text-neutral-100 text-lg sm:text-xl md:text-2xl tracking-tighter font-extrabold leading-none translate-y-[0.04em] transition-colors duration-200 group-hover:text-red-600">
              Strawby
            </span>
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="relative z-80 flex flex-col gap-1.5 sm:gap-2 cursor-pointer p-3 shrink-0"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <span className={`block h-0.75 transition-all duration-300 origin-center rounded-full ${menuOpen ? 'w-7 sm:w-8 bg-white rotate-45 translate-y-2.5 sm:translate-y-3' : 'w-7 sm:w-8 bg-neutral-950 dark:bg-neutral-100'}`} />
            <span className={`block h-0.75 transition-all duration-300 rounded-full ${menuOpen ? 'w-7 sm:w-8 bg-white opacity-0' : 'w-6 sm:w-7 bg-neutral-950 dark:bg-neutral-100'}`} />
            <span className={`block h-0.75 transition-all duration-300 origin-center rounded-full ${menuOpen ? 'w-7 sm:w-8 bg-white -rotate-45 -translate-y-2.5 sm:-translate-y-3' : 'w-6 sm:w-7 bg-neutral-950 dark:bg-neutral-100'}`} />
          </button>
        </header>
      </div>

      <TabBar hidden={menuOpen} />

      <BlobMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pb-24 sm:pb-28 lg:pb-32">{children}</main>

      <NotificationPermissionPopup />
    </div>
  )
}
