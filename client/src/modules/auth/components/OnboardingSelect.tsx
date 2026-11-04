import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useDismiss } from '@/shared/hooks/useDismiss'

type Option = { value: string; label: string }

interface OnboardingSelectProps {
  label: string
  /** Valor selecionado — string vazia quando nada foi escolhido. */
  value: string
  options: Option[]
  onSelect: (value: string) => void
}

/**
 * Lista suspensa do onboarding.
 * O `<select>` nativo abre o popup do sistema operacional, que ignora o visual
 * do app e, com 111 anos na lista, cobre metade da tela.
 */
export default function OnboardingSelect({
  label,
  value,
  options,
  onSelect,
}: OnboardingSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useDismiss<HTMLDivElement>(isOpen, () => setIsOpen(false))

  const selected = options.find((option) => option.value === value)

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <span className="px-1 text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex w-full cursor-pointer items-center justify-between gap-1 rounded-2xl border-2 border-b-4 py-4 pl-4 pr-3 text-[15px] font-extrabold tracking-tight transition-colors duration-150 ${
          isOpen
            ? 'border-red-500 border-b-red-500 bg-white dark:bg-neutral-900'
            : 'border-neutral-200 border-b-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:border-b-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800/60'
        } ${selected ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-300 dark:text-neutral-600'}`}
      >
        <span className="min-w-0 flex-1 truncate text-center">{selected?.label ?? '—'}</span>
        <ChevronDown
          size={15}
          strokeWidth={3}
          className={`shrink-0 text-neutral-300 transition-transform duration-150 dark:text-neutral-600 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 z-50 mt-2 max-h-60 w-full origin-top overflow-y-auto overscroll-contain rounded-2xl border-2 border-neutral-200 bg-white p-1.5 shadow-xl shadow-neutral-900/10 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/50"
          >
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    // a lista de anos nasce rolada na seleção, senão abre em 2016.
                    // `scrollTop` em vez de `scrollIntoView` pra não arrastar a página
                    ref={(node) => {
                      if (!node || !isSelected) return
                      const list = node.closest('ul')
                      if (!list) return
                      list.scrollTop = node.offsetTop - list.clientHeight / 2 + node.clientHeight / 2
                    }}
                    onClick={() => {
                      onSelect(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-center text-[15px] font-bold tabular-nums transition-colors duration-100 ${
                      isSelected
                        ? 'bg-red-500 text-white'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
