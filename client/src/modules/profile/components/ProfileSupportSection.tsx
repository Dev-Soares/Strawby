import { useNavigate } from 'react-router-dom'
import { Question, FileText, ShieldCheck, CaretRight } from '@phosphor-icons/react'

const links = [
  { label: 'Perguntas frequentes', Icon: Question, path: '/faq' },
  { label: 'Termos de uso', Icon: FileText, path: '/terms' },
  { label: 'Política de privacidade', Icon: ShieldCheck, path: '/privacy' },
]

export default function ProfileSupportSection() {
  const navigate = useNavigate()

  return (
    <section className="mb-5">
      <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
        Suporte
      </p>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
        {links.map(({ label, Icon, path }, i) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer ${
              i < links.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Icon size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <span className="flex-1 text-sm font-semibold text-neutral-800 dark:text-neutral-100 text-left">
              {label}
            </span>
            <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 shrink-0" />
          </button>
        ))}
      </div>
    </section>
  )
}
