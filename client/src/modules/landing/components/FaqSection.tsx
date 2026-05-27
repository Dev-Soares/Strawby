import { motion } from 'framer-motion'

const faqs = [
  {
    question: 'O que é o Strawby?',
    answer:
      'É um app para acompanhar calorias, macros e refeições do dia a dia. Você organiza sua alimentação, monitora metas e enxerga seu progresso com clareza.',
  },
  {
    question: 'Como eu começo a usar?',
    answer:
      'Crie sua conta, configure seu plano nutricional e depois registre suas refeições. A tela inicial mostra o consumo do dia e o que ainda falta para bater a meta.',
  },
  {
    question: 'Como funciona a busca de alimentos?',
    answer:
      'Você pode buscar alimentos na base pública, conferir os valores nutricionais e adicionar o item certo à sua refeição. Também dá para usar alimentos privados quando quiser algo mais específico.',
  },
  {
    question: 'Posso criar minhas próprias receitas e alimentos?',
    answer:
      'Sim. O app permite cadastrar alimentos privados e montar receitas para reutilizar nas suas refeições depois, sem precisar refazer tudo manualmente.',
  },
  {
    question: 'O Strawby mostra minhas metas de calorias e macros?',
    answer:
      'Mostra sim. O plano diário acompanha calorias, proteína, carboidratos e gordura, e a pontuação ajuda a visualizar a consistência ao longo do tempo.',
  },
  {
    question: 'Preciso instalar para usar?',
    answer:
      'Não. Você pode usar no navegador e também instalar no celular quando quiser uma experiência mais parecida com app nativo.',
  },
]

export default function FaqSection() {
  return (
    <section id="faq" className="bg-stone-50 dark:bg-neutral-950 py-24 sm:py-28 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          className="mb-12 sm:mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-3">
            FAQ
          </p>
          <h2 className="font-display text-[36px] sm:text-[48px] lg:text-[56px] font-black tracking-[-0.04em] leading-[0.92] text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
            Dúvidas comuns,
            <br />
            respostas diretas.
          </h2>
          <p className="mt-5 text-[17px] sm:text-[18px] leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-xl transition-colors duration-300">
            Tudo que você precisa para entender o fluxo do Strawby antes de começar a acompanhar sua alimentação.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {faqs.map((faq, index) => (
            <motion.details
              key={faq.question}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 sm:px-6 py-5 shadow-[0_16px_30px_-24px_rgba(0,0,0,0.2)] transition-colors duration-300"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="font-semibold text-[15px] sm:text-base text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
                  {faq.question}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors duration-300 group-open:bg-red-600 group-open:text-white">
                  <span className="text-lg font-black leading-none group-open:hidden">+</span>
                  <span className="hidden text-lg font-black leading-none group-open:block">−</span>
                </span>
              </summary>
              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400 pr-10 transition-colors duration-300">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}