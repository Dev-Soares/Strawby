import { useEffect, useState } from 'react'
import BlobMenu from './BlobMenu'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPaddingRight = document.body.style.paddingRight

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPaddingRight
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className={`sticky top-0 z-60 flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 md:h-20 transition-colors duration-300 ${menuOpen ? 'bg-transparent' : 'bg-neutral-50/80 backdrop-blur-md'}`}>
        <div
          className={`flex items-center gap-2 sm:gap-3 transition-opacity duration-200 ${
            menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <img src="/logo.png" alt="" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
          <span className="font-display text-neutral-950 text-base sm:text-lg md:text-xl tracking-tighter font-extrabold">
            Strawby
          </span>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="z-70 flex flex-col gap-1.5 sm:gap-2 cursor-pointer p-2 relative"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className={`block h-0.75 transition-all duration-300 origin-center rounded-full ${menuOpen ? 'w-6 sm:w-7 bg-white rotate-45 translate-y-2.5 sm:translate-y-3' : 'w-6 sm:w-7 bg-neutral-950'}`} />
          <span className={`block h-0.75 transition-all duration-300 rounded-full ${menuOpen ? 'w-6 sm:w-7 bg-white opacity-0' : 'w-5 sm:w-6 bg-neutral-950'}`} />
          <span className={`block h-0.75 transition-all duration-300 origin-center rounded-full ${menuOpen ? 'w-6 sm:w-7 bg-white -rotate-45 -translate-y-2.5 sm:-translate-y-3' : 'w-5 sm:w-6 bg-neutral-950'}`} />
        </button>
      </header>

      <BlobMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>{children}</main>
    </div>
  )
}
