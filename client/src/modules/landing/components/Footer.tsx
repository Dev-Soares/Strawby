import { ArrowUpRight, InstagramLogo, XLogo, GithubLogo } from '@phosphor-icons/react'

const productLinks = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Preços', href: '#precos' },
  { label: 'Mudanças', href: '/changelog' },
]

const legalLinks = [
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos', href: '/termos' },
  { label: 'Cookies', href: '/cookies' },
]

const socials = [
  { icon: InstagramLogo, href: 'https://instagram.com', label: 'Instagram' },
  { icon: XLogo, href: 'https://x.com', label: 'X' },
  { icon: GithubLogo, href: 'https://github.com', label: 'GitHub' },
]

export default function Footer() {
  return (
    <footer className="relative bg-white text-neutral-950 overflow-hidden border-t border-neutral-200 ">
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 lg:pt-28 pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 lg:gap-16 pb-16 border-b border-neutral-200">

          <div>
            <a href="/" className="inline-flex items-center gap-2.5 mb-10 group">
              <img src="/logo.png" alt="Strawby" className="w-10 h-10 object-contain" />
              <span className="font-display text-neutral-950 text-xl tracking-tighter font-extrabold">
                Strawby
              </span>
            </a>

            <h3 className="font-display text-[44px] sm:text-[56px] font-black tracking-[-0.03em] leading-[0.95] mb-8">
              Coma melhor.<br />
              <span className="text-red-600">Todo dia.</span>
            </h3>

            <a
              href="/app/create-account"
              className="group inline-flex hover:translate-y-[-2px] items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-full transition-all duration-200 text-sm"
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
                  <a
                    href={href}
                    className="text-neutral-600 hover:text-neutral-950 transition-colors duration-150 text-[15px] font-medium"
                  >
                    {label}
                  </a>
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
                    className="text-neutral-600 hover:text-neutral-950 transition-colors duration-150 text-[15px] font-medium"
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
                    className="flex w-10 h-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-200"
                  >
                    <Icon size={16} weight="bold" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8">
          <p className="text-xs text-neutral-500 tracking-wide">
            © {new Date().getFullYear()} Strawby. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em] font-bold">
            Feito para quem leva saúde a sério
          </p>
        </div>
      </div>

    </footer>
  )
}
