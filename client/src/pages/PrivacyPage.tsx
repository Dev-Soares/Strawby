export default function PrivacyPage() {
  const dataItems = [
    'Nome',
    'Endereço de e-mail',
    'Refeições registradas',
    'Metas calóricas',
    'Informações de uso da plataforma',
  ]

  const technicalItems = ['Tipo de dispositivo', 'Navegador utilizado', 'Endereço IP', 'Dados de acesso e utilização']

  const purposeItems = [
    'Permitir o funcionamento da plataforma',
    'Personalizar a experiência do usuário',
    'Armazenar registros alimentares e metas',
    'Melhorar funcionalidades e desempenho do sistema',
    'Garantir segurança e estabilidade da plataforma',
    'Enviar notificações relacionadas ao uso do aplicativo, caso o usuário permita',
  ]

  const privacyControls = [
    'Acesso aos seus dados pessoais',
    'Correção de informações incorretas',
    'Exclusão de dados pessoais',
    'Revogação de consentimentos eventualmente concedidos',
  ]

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.1),transparent_28%),linear-gradient(180deg,rgba(250,250,250,1),rgba(245,245,245,1))] text-neutral-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_right,rgba(127,29,29,0.28),transparent_24%),linear-gradient(180deg,#09090b_0%,#09090b_100%)] dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="rounded-[2rem] border border-neutral-200 bg-white/90 p-6 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.28)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 sm:p-8 lg:sticky lg:top-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-red-900/50 dark:hover:text-red-300"
            >
              <span aria-hidden="true">←</span>
              Voltar
            </button>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-400">
                Política de Privacidade
              </p>
              <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Política de Privacidade
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
                Esta política explica quais dados o Strawby coleta, por que esses dados são usados e quais controles o usuário tem para administrar, exportar e excluir suas informações.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">Última atualização: 25 de maio de 2026</span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">Contato: strawbyapp@gmail.com</span>
              <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 dark:border-neutral-700 dark:bg-neutral-800">Strawby • Barra Mansa - RJ</span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['Dados', 'Informações pessoais e técnicas'],
                ['Controles', 'Acesso, correção e exclusão'],
                ['Segurança', 'Proteção e retenção responsável'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{value}</p>
                </div>
              ))}
            </div>
          </aside>

          <article className="space-y-4 sm:space-y-5">
            <section id="introducao" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">Introdução</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O Strawby é uma plataforma web/PWA voltada ao acompanhamento nutricional, organização de refeições e
                    metas calóricas. A plataforma funciona como ferramenta de apoio e organização pessoal e não substitui
                    orientação médica, nutricional ou profissional especializada.
                  </p>
                  <p>
                    Ao utilizar o Strawby, o usuário concorda com os termos desta Política de Privacidade.
                  </p>
                </div>
            </section>

            <section id="informacoes-coletadas" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Informações coletadas</h2>
                <p className="mt-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  O Strawby pode coletar informações fornecidas diretamente pelo usuário e dados técnicos gerados durante o uso da plataforma.
                </p>

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Dados fornecidos pelo usuário</h3>
                    <ul className="mt-4 space-y-2 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                      {dataItems.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Dados técnicos</h3>
                    <ul className="mt-4 space-y-2 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                      {technicalItems.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
            </section>

            <section id="por-que-coletamos" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Por que coletamos dados</h2>
                <ul className="mt-4 space-y-3 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  {purposeItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
            </section>

            <section id="controles" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Seus controles de privacidade</h2>
                <p className="mt-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  Nos termos da legislação aplicável, incluindo a Lei Geral de Proteção de Dados (LGPD), o usuário pode solicitar o seguinte:
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {privacyControls.map((item) => (
                    <li key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] leading-7 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  Solicitações podem ser feitas pelo e-mail <span className="font-semibold text-neutral-950 dark:text-neutral-50">strawbyapp@gmail.com</span>.
                </p>
            </section>

            <section id="compartilhamento" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Compartilhamento de informações</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>O Strawby não vende dados pessoais dos usuários.</p>
                  <p>
                    Determinadas informações podem ser processadas por serviços terceirizados necessários para hospedar, autenticar, armazenar e operar a plataforma.
                  </p>
                  <p>
                    Quando o Strawby utilizar notificações ou serviços externos, o usuário poderá controlar essas permissões nas configurações do dispositivo ou navegador.
                  </p>
                </div>
            </section>

            <section id="seguranca" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Manter suas informações seguras</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O Strawby adota medidas técnicas e organizacionais razoáveis para proteger os dados dos usuários contra acesso não autorizado, alteração, divulgação ou destruição indevida.
                  </p>
                  <p>
                    Apesar dos esforços de segurança, nenhum sistema é completamente seguro e não é possível garantir segurança absoluta das informações transmitidas pela internet.
                  </p>
                </div>
            </section>

            <section id="exportar-excluir" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Exportar e excluir informações</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    O usuário pode solicitar a exclusão da conta e dos dados pessoais a qualquer momento, além de revogar consentimentos eventualmente concedidos.
                  </p>
                  <p>
                    Quando aplicável, o Strawby pode orientar sobre a remoção de conteúdos ou sobre a exclusão de informações associadas à conta.
                  </p>
                </div>
            </section>

            <section id="retencao" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Retenção das informações</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    Os dados coletados podem ser mantidos pelo período necessário para operar a plataforma, cumprir obrigações legais, prevenir abusos e preservar a segurança.
                  </p>
                  <p>
                    Após a exclusão, o Strawby busca remover as informações de forma segura, podendo manter cópias residuais apenas pelo tempo necessário em backups ou obrigações legais.
                  </p>
                </div>
            </section>

            <section id="sobre" className="scroll-mt-8 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.3)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 lg:p-7">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">Sobre esta política</h2>
                <div className="mt-4 space-y-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                  <p>
                    Esta política pode ser alterada periodicamente para refletir melhorias, mudanças legais ou ajustes na plataforma.
                  </p>
                  <p>
                    Recomendamos revisar esta página regularmente. Se as alterações forem relevantes, o Strawby poderá destacar a mudança com antecedência razoável.
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
  )
}
