import { Link } from 'react-router-dom'
import { ArrowUpRight, InstagramLogo } from '@phosphor-icons/react'

const productLinks = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'FAQ', href: '/faq' },
]

const legalLinks = [
  { label: 'Privacidade', href: '/privacy' },
  { label: 'Termos', href: '/terms' },
]

const socials = [
  { icon: InstagramLogo, href: 'https://www.instagram.com/strawbyapp/', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="relative bg-white dark:bg-neutral-950 text-neutral-950 dark:text-neutral-100 overflow-hidden border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 lg:pt-28 pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 lg:gap-16 pb-16 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">

          <div>
            <a href="/" className="inline-flex items-center gap-2.5 mb-10 group">
              <img src="/logo.webp" alt="Strawby" className="w-10 h-10 object-contain" />
               <span className="font-display text-neutral-950 dark:text-neutral-100 text-xl tracking-tighter font-extrabold transition-colors duration-300">
                Strawby
              </span>
            </a>

            <h3 className="font-display text-[44px] sm:text-[56px] font-black tracking-[-0.03em] leading-[0.95] mb-8 text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
              Coma melhor.<br />
              <span className="text-red-600">Todo dia.</span>
            </h3>

            <a
              href="/app/create-account"
              className="group inline-flex hover:-translate-y-0.5 items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-full transition-all duration-200 text-sm"
            >
              Começar grátis
              <ArrowUpRight size={16} weight="bold" className="group-hover:rotate-45 transition-transform duration-200" />
            </a>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-6">
              Produto
            </p>
            <ul className="flex flex-col gap-3.5">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link
                      to={href}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors duration-150 text-[15px] font-medium"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors duration-150 text-[15px] font-medium"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-6">
              Legal
            </p>
            <ul className="flex flex-col gap-3.5">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors duration-150 text-[15px] font-medium"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-6">
              Siga
            </p>
            <ul className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex w-10 h-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-200"
                  >
                    <Icon size={16} weight="bold" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 tracking-wide transition-colors duration-300">
            © {new Date().getFullYear()} Strawby. Todos os direitos reservados.
          </p>
        
        </div>
      </div>

    </footer>
  )
}
