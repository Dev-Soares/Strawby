import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, House } from 'lucide-react'
import PageSEO from '@/shared/components/PageSEO'
import StrawbyMascot from '@/shared/components/StrawbyMascot'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
})

export default function NotFoundPage() {
  return (
    <>
      <PageSEO
        title="Página não encontrada - Strawby"
        description="A página que você tentou acessar não existe."
        path="/404"
      />
      <main className="flex min-h-svh flex-col items-center justify-center bg-white px-6 py-16 transition-colors duration-300 dark:bg-neutral-950">
        <div className="flex w-full max-w-lg flex-col items-center text-center">
          {/* O mascote carrega o tom da página: decepção, não erro técnico. */}
          <motion.div
            className="h-44 w-44 sm:h-52 sm:w-52"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            <StrawbyMascot
              action="upset"
              playback="once"
              className="h-full w-full drop-shadow-[0_16px_28px_rgba(220,38,38,0.16)]"
            />
          </motion.div>

          <motion.h1
            className="mt-4 font-display text-[40px] font-black leading-[0.92] tracking-tighter text-neutral-950 transition-colors duration-300 sm:text-[54px] dark:text-neutral-50"
            {...fadeUp(0.1)}
          >
            Essa página <span className="text-red-600">não existe.</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-md text-base font-medium leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400"
            {...fadeUp(0.18)}
          >
            O endereço que você acessou foi movido ou nunca existiu. Nada se perdeu
            no caminho: seus registros continuam lá.
          </motion.p>

          <motion.div
            className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center"
            {...fadeUp(0.28)}
          >
            <Link
              to="/app/home"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-red-600 px-8 py-4 text-[15px] font-semibold text-white transition-colors duration-150 hover:border-red-700 hover:bg-red-700 active:border-red-800 active:bg-red-800"
            >
              Voltar para o app
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-stone-200 bg-white px-8 py-4 text-[15px] font-semibold text-neutral-700 transition-colors duration-150 hover:border-stone-300 hover:bg-stone-50 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
            >
              <House size={17} />
              Ir para o início
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  )
}
