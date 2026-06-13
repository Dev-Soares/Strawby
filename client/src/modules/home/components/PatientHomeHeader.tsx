import { motion } from 'framer-motion'

interface Props {
  name: string
}

export default function PatientHomeHeader({ name }: Props) {
  return (
    <motion.div
      className="mb-6 sm:mb-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight mb-2 transition-colors duration-300">
        Olá, {name}
      </p>
      <h1 className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight transition-colors duration-300">
        Vamos cuidar da sua{' '}
        <span className="text-red-600">alimentação</span>?
      </h1>
    </motion.div>
  )
}
