import { motion } from 'framer-motion'

interface Props {
  name: string
}

export default function NutritionistHeader({ name }: Props) {
  return (
    <motion.div
      className="mb-8 sm:mb-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
    </motion.div>
  )
}
