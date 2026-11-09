import { Link } from 'react-router-dom'
import { InstagramLogo } from '@phosphor-icons/react'
import { useSmoothScrollTo } from '@/shared/hooks/useSmoothScrollTo'

const productLinks = [
  { label: 'Conheça o Strawby', href: '#conheca' },
  { label: 'Funcionalidades', href: '#diferenciais' },
  { label: 'Começar agora', href: '/app/create-account' },
]

const legalLinks = [
  { label: 'Termos de uso', href: '/terms' },
  { label: 'Política de privacidade', href: '/privacy' },
]

const socials = [
  {
    icon: InstagramLogo,
    href: 'https://www.instagram.com/strawbyapp/',
    label: 'Instagram',
  },
]

export default function Footer() {
  const scrollToAnchor = useSmoothScrollTo()

  return (
    <footer className="relative bg-red-600 text-white selection:bg-white selection:text-red-600 pt-6 sm:pt-10 pb-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* ================================================================= */}
        {/* 1. Área Superior: Identidade Institucional + Colunas de Links     */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 gap-12 pb-14 border-b border-white/20 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr] lg:gap-10">
          {/* Apresentação da Marca */}
          <div className="max-w-sm">
            <a href="/" className="inline-flex items-center gap-3 select-none mb-5">
              <img
                draggable={false}
                src="/logo.webp"
                width={128}
                height={128}
                alt="Strawby"
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Strawby
              </span>
            </a>

            <p className="font-display text-base font-bold text-white mb-2">
              Pequenos passos, grandes mudanças.
            </p>

            <p className="text-sm font-medium leading-relaxed text-white/80">
              Acompanhe suas refeições, entenda seus hábitos e construa uma rotina saudável sem complicação.
            </p>
          </div>

          {/* Coluna 1: Produto */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-4">
              Produto
            </p>
            <ul className="flex flex-col gap-3">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(event) => scrollToAnchor(event, href)}
                    className="text-sm font-semibold text-white/90 hover:text-white hover:underline transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        

          {/* Coluna 2: Legal */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm font-semibold text-white/90 hover:text-white hover:underline transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 mb-4">
              Redes sociais
            </p>
            <ul className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200"
                  >
                    <Icon size={20} weight="fill" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. Área Inferior: Copyright e Informações                         */}
        {/* ================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-white/75">
          <p>© 2026 Strawby. Todos os direitos reservados.</p>
          
        </div>
      </div>
    </footer>
  )
}
