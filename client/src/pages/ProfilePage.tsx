import { useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Monitor,
  SignOut,
  Question,
  FileText,
  ShieldCheck,
  CaretRight,
  EnvelopeSimple,
  Calendar,
} from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import type { ThemePreference } from '@/shared/hooks/useTheme'

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const themeOptions: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Escuro', Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: Monitor },
]

export default function ProfilePage() {
  const { data: user } = useAuth()
  const signOut = useSignOut()
  const { theme, setTheme } = useThemeContext()
  const navigate = useNavigate()

  const initials = user?.name ? getInitials(user.name) : '?'

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 max-w-2xl mx-auto">

        {/* Avatar hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="font-display text-3xl font-extrabold text-white tracking-tight">
              {initials}
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">
            {user?.name ?? '—'}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {user?.email ?? '—'}
          </p>
        </div>

        {/* Conta */}
        <section className="mb-5">
          <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Conta
          </p>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <EnvelopeSimple size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">E-mail</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{user?.email ?? '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <Calendar size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Membro desde</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Preferências — tema */}
        <section className="mb-5">
          <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Preferências
          </p>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 transition-colors duration-300">
            <p className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">Tema</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, Icon }) => {
                const active = theme === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/30'
                        : 'border-transparent bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-150 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon size={18} weight={active ? 'fill' : 'regular'} className={active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400'} />
                    <span className={`text-xs font-bold ${active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Suporte */}
        <section className="mb-5">
          <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Suporte
          </p>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
            {[
              { label: 'Perguntas frequentes', icon: Question, path: '/faq' },
              { label: 'Termos de uso', icon: FileText, path: '/terms' },
              { label: 'Política de privacidade', icon: ShieldCheck, path: '/privacy' },
            ].map(({ label, icon: Icon, path }, i, arr) => (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer ${
                  i < arr.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''
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

        {/* Sair */}
        <button
          type="button"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer shadow-sm"
        >
          {signOut.isPending ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <SignOut size={17} weight="bold" />
          )}
          {signOut.isPending ? 'Saindo…' : 'Sair da conta'}
        </button>

      </div>
    </AppLayout>
  )
}
