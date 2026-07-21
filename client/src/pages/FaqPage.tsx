import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import PageSEO from '@/shared/components/PageSEO'
import AccordionItem from '@/shared/components/AccordionItem'

type FaqItem = {
  question: string
  answer: string
}

type FaqGroup = {
  title: string
  description: string
  items: FaqItem[]
}

const faqGroups: FaqGroup[] = [
  {
    title: 'Comece do jeito certo',
    description: 'Tudo o que você precisa saber para entrar e configurar sua rotina no Strawby.',
    items: [
      {
        question: 'O que é o Strawby?',
        answer:
          'É um app para acompanhar calorias, macros e refeições do dia a dia. A ideia é transformar a alimentação em algo visual, simples e consistente.',
      },
      {
        question: 'Como eu começo a usar?',
        answer:
          'Crie sua conta, defina seu plano nutricional e comece a registrar refeições. A tela inicial mostra o consumo do dia e a evolução da sua meta.',
      },
      {
        question: 'Preciso instalar o app para usar?',
        answer:
          'Não. Você pode usar no navegador normalmente e, se quiser, instalar como PWA no celular para uma experiência mais próxima de aplicativo nativo.',
      },
    ],
  },
  {
    title: 'Alimentos e receitas',
    description: 'Como buscar itens, salvar favoritos e reaproveitar preparos sem retrabalho.',
    items: [
      {
        question: 'Como funciona a busca de alimentos?',
        answer:
          'Você pesquisa na base pública, confere os valores nutricionais e escolhe o item mais próximo do que consumiu. A busca foi pensada para ser rápida e prática.',
      },
      {
        question: 'Posso criar meus próprios alimentos?',
        answer:
          'Sim. O Strawby permite cadastrar alimentos privados para deixar seu uso mais fiel à sua rotina e mais fácil de repetir depois.',
      },
      {
        question: 'E as receitas, como entram nisso?',
        answer:
          'Você pode montar receitas com vários ingredientes e reutilizá-las nas refeições futuras. Isso reduz o tempo de registro e mantém seus cálculos consistentes.',
      },
    ],
  },
  {
    title: 'Metas e progresso',
    description: 'Como acompanhar consistência, macros e evolução diária.',
    items: [
      {
        question: 'O Strawby mostra minhas metas de calorias e macros?',
        answer:
          'Mostra sim. O plano diário inclui calorias, proteína, carboidratos e gordura, com visualização clara do que já foi consumido e do que ainda falta.',
      },
      {
        question: 'O que é a pontuação do app?',
        answer:
          'A pontuação ajuda a visualizar sua consistência ao longo do tempo. Ela funciona como um resumo simples da sua aderência diária ao plano.',
      },
      {
        question: 'Posso editar meu plano depois?',
        answer:
          'Pode. O plano é ajustável para que você adapte metas conforme seu objetivo, seu ritmo e a sua rotina real.',
      },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqGroups.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  ),
}

export default function FaqPage() {
  return (
    <>
      <PageSEO
        title="Perguntas Frequentes — Strawby"
        description="Tire suas dúvidas sobre o Strawby: como criar conta, registrar refeições, buscar alimentos, criar receitas e acompanhar metas de calorias e macros."
        path="/faq"
        jsonLd={faqSchema}
      />
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.9),transparent_35%)] text-neutral-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_right,rgba(127,29,29,0.35),transparent_24%),linear-gradient(180deg,#09090b_0%,#09090b_100%)] dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <section className="rounded-[2rem] border border-neutral-200 bg-white/90 px-5 py-6 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.28)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 sm:px-7 sm:py-8 lg:sticky lg:top-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-red-900/50 dark:hover:text-red-300"
            >
              <ArrowLeft size={16} weight="bold" />
              Voltar para a home
            </Link>

            <div className="mt-8 sm:mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
                FAQ
              </p>
              <h1 className="mt-3 max-w-xl font-display text-4xl font-black tracking-[-0.04em] leading-[0.92] sm:text-5xl lg:text-6xl">
                Perguntas frequentes,
                <span className="block text-red-600">sem enrolação.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-7 text-neutral-600 dark:text-neutral-400">
                Tudo o que você precisa para entender o Strawby antes de começar: conta, metas, alimentos, receitas e como acompanhar sua evolução.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Fluxo</p>
                <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Conta, plano e registro diário</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Base</p>
                <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Busca pública, alimentos privados e receitas</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Acompanhamento</p>
                <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Macros, consistência e pontuação</p>
              </div>
            </div>

            <Link
              to="/app/create-account"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700"
            >
              Criar conta
              <ArrowRight size={16} weight="bold" />
            </Link>
          </section>

          <section className="space-y-6 sm:space-y-8">
            {faqGroups.map((group, index) => (
              <motion.section
                key={group.title}
                className="rounded-[2rem] border border-neutral-200 bg-white p-4 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: [0.34, 1.05, 0.64, 1], delay: index * 0.06 }}
              >
                <div className="mb-5 sm:mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-red-600">
                    Grupo {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-neutral-950 dark:text-neutral-100 sm:text-2xl">
                    {group.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
                    {group.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <AccordionItem key={item.question} {...item} />
                  ))}
                </div>
              </motion.section>
            ))}
          </section>
        </div>
      </div>
    </main>
    </>
  )
}