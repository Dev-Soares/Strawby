import { Sun, Moon, Monitor } from '@phosphor-icons/react'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'

const themeOptions = [
  { value: 'light' as const, label: 'Claro', Icon: Sun },
  { value: 'dark' as const, label: 'Escuro', Icon: Moon },
  { value: 'system' as const, label: 'Sistema', Icon: Monitor },
]

export default function ProfileThemeSection() {
  const { theme, setTheme } = useThemeContext()

  return (
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
  )
}
