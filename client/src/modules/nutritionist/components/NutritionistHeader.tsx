import { motion } from 'framer-motion'
import { Key, PencilSimple } from '@phosphor-icons/react'

interface Props {
  name: string
  code: string | null
  onEditCode: () => void
}

export default function NutritionistHeader({ name, code, onEditCode }: Props) {
  return (
    <motion.div
      className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <p className="text-xs sm:text-sm font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3 sm:mb-4 transition-colors duration-300">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }).replace(/^\w/, (c) => c.toUpperCase())}
        </p>
        <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight mb-2 transition-colors duration-300">
          Olá, {name}
        </p>
        <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight transition-colors duration-300">
          Gerencie seus <span className="text-red-600">pacientes</span>
        </h1>
      </div>

      <button
        onClick={onEditCode}
        className="flex items-center gap-2.5 self-start sm:self-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-2xl px-4 py-3 transition-all duration-200 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors duration-200">
          <Key size={15} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
        </div>
        <div className="text-left min-w-0">
          <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Código de convite</p>
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300 truncate">
            {code ?? 'Não definido'}
          </p>
        </div>
        <PencilSimple size={13} weight="bold" className="text-neutral-400 dark:text-neutral-500 shrink-0 ml-1" />
      </button>
    </motion.div>
  )
}
