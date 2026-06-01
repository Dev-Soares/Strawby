import { useEffect, useState } from 'react'
import BlobMenu from './BlobMenu'
import TopTabBar from './TopTabBar'

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
      <div className={`sticky top-0 z-60 pt-3 sm:pt-4 transition-colors duration-300 ${menuOpen ? 'bg-transparent' : 'bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md'}`}>
        <header className="flex items-center justify-between px-5 sm:px-8 h-14 sm:h-16 md:h-20">
          <div
            className={`flex items-center gap-2.5 sm:gap-3 transition-opacity duration-200 ${
              menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <img src="/logo.webp" alt="" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            <span className="font-display text-neutral-950 dark:text-neutral-100 text-lg sm:text-xl md:text-2xl tracking-tighter font-extrabold transition-colors duration-300">
              Strawby
            </span>
          </div>
        </header>

        <div className="hidden sm:block">
          <TopTabBar hidden={menuOpen} />
        </div>
      </div>

      <TopTabBar variant="bottom" hidden={menuOpen} />

      <BlobMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="fixed top-6 right-3 sm:top-8 sm:right-5 md:top-9 md:right-6 z-70 flex flex-col gap-1.5 sm:gap-2 cursor-pointer p-3"
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        <span className={`block h-0.75 transition-all duration-300 origin-center rounded-full ${menuOpen ? 'w-7 sm:w-8 bg-white rotate-45 translate-y-2.5 sm:translate-y-3' : 'w-7 sm:w-8 bg-neutral-950 dark:bg-neutral-100'}`} />
        <span className={`block h-0.75 transition-all duration-300 rounded-full ${menuOpen ? 'w-7 sm:w-8 bg-white opacity-0' : 'w-6 sm:w-7 bg-neutral-950 dark:bg-neutral-100'}`} />
        <span className={`block h-0.75 transition-all duration-300 origin-center rounded-full ${menuOpen ? 'w-7 sm:w-8 bg-white -rotate-45 -translate-y-2.5 sm:-translate-y-3' : 'w-6 sm:w-7 bg-neutral-950 dark:bg-neutral-100'}`} />
      </button>

      <main className="pb-24 sm:pb-0">{children}</main>
    </div>
  )
}
