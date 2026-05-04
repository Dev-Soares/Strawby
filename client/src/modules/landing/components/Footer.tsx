import { ArrowRight } from '@phosphor-icons/react'

const productLinks = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Preços', href: '#precos' },
]

const legalLinks = [
  { label: 'Privacidade', href: '/privacidade' },
  { label: 'Termos', href: '/termos' },
]

export default function Footer() {
  return (
    <footer className="bg-white flex flex-col justify-between px-6 py-16 border-t border-neutral-100">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-between">

        {/* Main area */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-16 pt-8">

          {/* Brand side */}
          <div className="max-w-sm">
            <a href="/" className="flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="Strawby" className="w-10 h-10 object-contain" />
              <span
                className="text-neutral-950 text-xl tracking-tighter"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800 }}
              >
                Strawby
              </span>
            </a>

            <p className="text-[40px] font-black tracking-tighter text-neutral-950 leading-[1.05] mb-8">
              Coma melhor.<br />
              <span className="text-red-600">Todo dia.</span>
            </p>

            <a
              href="/create-account"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-150 text-sm"
            >
              Começar grátis
              <ArrowRight size={15} weight="bold" />
            </a>
          </div>

          {/* Links */}
          <div className="flex gap-16 sm:gap-24">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6">
                Produto
              </p>
              <ul className="flex flex-col gap-4">
                {productLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-neutral-600 hover:text-neutral-950 transition-colors duration-150 text-sm font-medium"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6">
                Legal
              </p>
              <ul className="flex flex-col gap-4">
                {legalLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-neutral-600 hover:text-neutral-950 transition-colors duration-150 text-sm font-medium"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-10 border-t border-neutral-100 mt-16">
          <p className="text-xs text-neutral-400">
            © 2025 Strawby. Todos os direitos reservados.
          </p>
          <p className="text-xs text-neutral-400">
            Feito para quem leva saúde a sério.
          </p>
        </div>

      </div>
    </footer>
  )
}
