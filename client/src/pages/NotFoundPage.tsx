import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, SmileyMelting } from '@phosphor-icons/react'
import PageSEO from '@/shared/components/PageSEO'

export default function NotFoundPage() {
  return (
    <>
      <PageSEO
        title="Página não encontrada — Strawby"
        description="A página que você tentou acessar não existe."
        path="/404"
      />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.9),transparent_35%)] text-neutral-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_right,rgba(127,29,29,0.35),transparent_24%),linear-gradient(180deg,#09090b_0%,#09090b_100%)] dark:text-neutral-100 flex items-center justify-center px-4">
        <div className="mx-auto w-full max-w-lg">
          <motion.div
            className="rounded-[2rem] border border-neutral-200 bg-white/90 px-7 py-10 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.28)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.34, 1.05, 0.64, 1] }}
          >
            <div className="flex justify-center mb-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <SmileyMelting size={36} weight="duotone" />
              </span>
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600 mb-3">
              Erro 404
            </p>

            <h1 className="font-display text-4xl font-black tracking-[-0.04em] leading-[0.92] sm:text-5xl">
              Página não
              <span className="block text-red-600">encontrada.</span>
            </h1>

            <p className="mt-5 text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
              A URL que você tentou acessar não existe ou foi movida. Verifique o endereço ou volte para o início.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-red-900/50 dark:hover:text-red-300"
              >
                <ArrowLeft size={16} weight="bold" />
                Início
              </Link>

              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700"
              >
                Abrir app
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}
