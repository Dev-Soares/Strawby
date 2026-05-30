import PageSEO from '@/shared/components/PageSEO'

export default function TermsPage() {
  const relationshipItems = [
    'Fornecimento de uma experiência útil e em evolução',
    'Atualizações e melhorias contínuas da plataforma',
    'Avisos quando mudanças impactarem o uso do serviço',
  ]

  const expectedItems = [
    'Cumprir estes termos e as regras específicas aplicáveis ao serviço',
    'Respeitar outras pessoas, suas informações e seus direitos',
    'Não abusar dos serviços, sistemas ou funcionalidades do Strawby',
  ]

  const abuseItems = [
    'Usar a plataforma para fins ilícitos ou enganosos',
    'Tentar invadir, automatizar em excesso ou comprometer a segurança do sistema',
    'Enviar conteúdo malicioso, fraudulento ou que viole direitos de terceiros',
    'Fazer engenharia reversa, copiar ou deturpar os serviços da plataforma',
  ]

  const issueItems = [
    'A plataforma pode remover conteúdo que viole estes termos ou a legislação aplicável',
    'A conta pode ser suspensa ou encerrada em caso de violação relevante ou recorrente',
    'Sempre que possível, avisaremos com antecedência antes de tomar providências mais severas',
  ]

  return (
    <>
      <PageSEO
        title="Termos de Uso — Strawby"
        description="Leia os termos de uso do Strawby. Entenda suas responsabilidades e os nossos compromissos ao usar a plataforma de nutrição."
        path="/terms"
        noIndex={false}
      />
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_28%),linear-gradient(180deg,rgba(250,250,250,1),rgba(245,245,245,1))] text-neutral-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_right,rgba(120,53,15,0.32),transparent_24%),linear-gradient(180deg,#09090b_0%,#09090b_100%)] dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="rounded-4xl border border-neutral-200 bg-white/90 p-6 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.28)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 sm:p-8 lg:sticky lg:top-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:text-amber-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-amber-900/50 dark:hover:text-amber-300"
            >
              <span aria-hidden="true">←</span>
              Voltar
            </button>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                Termos de Uso
              </p>
              <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">Termos de Uso</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
                Estes termos estabelecem a relação entre você e o Strawby, descrevendo o que você pode esperar da plataforma e o que esperamos de quem a utiliza.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">Última atualização: 25 de maio de 2026</span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">Contato: strawbyapp@gmail.com</span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">Brasil</span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['Escopo', 'Uso da plataforma e regras gerais'],
                ['Conduta', 'Uso seguro e responsável'],
                ['Direitos', 'Conteúdo, licenças e proteção'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
                </div>
              ))}
            </div>
          </aside>

          <article className="space-y-4 sm:space-y-5">
            <section id="cobrimento" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">O que estes termos cobrem</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    Os presentes Termos de Uso regulam o acesso e utilização da plataforma Strawby. Ao acessar ou utilizar a plataforma, o usuário declara estar ciente e concordar com estes termos.
                  </p>
                  <p>
                    A Política de Privacidade também faz parte do contexto de uso da plataforma e complementa estas regras.
                  </p>
                </div>
            </section>

            <section id="relacionamento" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Seu relacionamento com o Strawby</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O Strawby é uma plataforma web/PWA voltada ao acompanhamento nutricional, organização de refeições e gerenciamento de metas calóricas.
                  </p>
                  <p>
                    A plataforma possui caráter exclusivamente informativo e organizacional, não substituindo orientação médica, nutricional ou profissional especializada.
                  </p>
                  <p>
                    Esperamos que o uso da plataforma seja coerente com esse propósito e com o respeito às demais pessoas e aos limites do serviço.
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  {relationshipItems.map((item) => (
                    <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] leading-7 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                      {item}
                    </div>
                  ))}
                </div>
            </section>

            <section id="uso" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Usando o Strawby</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    Para utilizar determinadas funcionalidades, o usuário deverá criar uma conta com endereço de e-mail e senha.
                  </p>
                  <p>O usuário é responsável por:</p>
                </div>

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
                  <ul className="grid gap-3 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300 sm:grid-cols-2">
                    {expectedItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-5 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  O Strawby não se responsabiliza por acessos não autorizados decorrentes de negligência do usuário.
                </p>

                <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-300">
                    É proibido
                  </p>
                  <ul className="mt-4 space-y-3 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                    {abuseItems.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </section>

            <section id="conteudo" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Conteúdo na plataforma</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O usuário é integralmente responsável pelas informações inseridas na plataforma, incluindo registros alimentares e metas pessoais.
                  </p>
                  <p>O Strawby não garante precisão nutricional absoluta das informações registradas ou exibidas.</p>
                  <p>
                    O conteúdo criado pelo usuário deve ser lícito e compatível com o uso esperado da plataforma.
                  </p>
                </div>
            </section>

            <section id="software" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Software e licenças</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O Strawby poderá realizar atualizações, manutenções, modificações ou interrupções temporárias do serviço a qualquer momento, sem aviso prévio.
                  </p>
                  <p>
                    Todos os elementos da plataforma, incluindo nome, identidade visual, interface, funcionalidades, código-fonte, textos e demais conteúdos, são protegidos pela legislação aplicável de propriedade intelectual.
                  </p>
                  <p>É proibida a reprodução, cópia, modificação ou distribuição sem autorização prévia.</p>
                </div>
            </section>

            <section id="problemas" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Em caso de problemas ou discordâncias</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O Strawby é fornecido “como está”, sem garantias expressas ou implícitas. A plataforma não se responsabiliza por decisões tomadas com base nas informações fornecidas, prejuízos decorrentes do uso ou indisponibilidade do serviço, perda de dados causada por fatores externos ou falhas técnicas.
                  </p>
                  <p>
                    Se houver violação relevante ou recorrente destes termos, o Strawby poderá remover conteúdo, suspender o acesso ou encerrar contas para proteger a plataforma e os demais usuários.
                  </p>
                </div>

                <div className="mt-6 grid gap-3">
                  {issueItems.map((item) => (
                    <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] leading-7 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                      {item}
                    </div>
                  ))}
                </div>
            </section>

            <section id="sobre" className="scroll-mt-8 rounded-4xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Sobre estes termos</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    Estes Termos de Uso serão regidos pelas leis da República Federativa do Brasil.
                  </p>
                  <p>
                    Os termos podem ser alterados periodicamente para refletir melhorias, alterações legais ou mudanças na plataforma. O uso contínuo do Strawby após alterações representa concordância com a versão atualizada.
                  </p>
                  <p>
                    Em caso de dúvidas, entre em contato pelo e-mail <span className="font-semibold text-neutral-950 dark:text-neutral-50">strawbyapp@gmail.com</span>.
                  </p>
                </div>
            </section>
          </article>
        </div>
      </div>
    </main>
    </>
  )
}
