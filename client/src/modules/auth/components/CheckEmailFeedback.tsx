import { EnvelopeSimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface CheckEmailFeedbackProps {
  email?: string
}

const CheckEmailFeedback = ({ email }: CheckEmailFeedbackProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto"
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <EnvelopeSimple size={32} className="text-neutral-700 dark:text-neutral-300" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Confirme seu e-mail
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enviamos um link de verificação para{' '}
          {email ? (
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{email}</span>
          ) : (
            'seu e-mail'
          )}
          . Clique no link para ativar sua conta.
        </p>
      </div>

      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Não recebeu? Verifique sua caixa de spam.
      </p>
    </motion.div>
  )
}

export default CheckEmailFeedback
