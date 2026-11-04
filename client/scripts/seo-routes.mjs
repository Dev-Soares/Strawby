/**
 * @typedef {object} SeoRoute
 * @property {string} path         Caminho público, começando com '/'.
 * @property {string} source       Página que define a rota (relativa à raiz do client).
 * @property {string} title        Deve bater com o title do <PageSEO> da página.
 * @property {string} description  Deve bater com a description do <PageSEO> da página.
 */

/**
 * Rotas públicas indexáveis — fonte única para o sitemap e para o prerender.
 *
 * `title` e `description` precisam bater com o <PageSEO> da página correspondente:
 * o PageSEO manda depois que o React monta, este arquivo manda no HTML estático que
 * os crawlers sem JS leem. Ao mexer num, mexa no outro.
 *
 * `source` é a página que define a rota — o lastmod do sitemap sai do último commit dela.
 */
/** @type {SeoRoute[]} */
export const SEO_ROUTES = [
  {
    path: '/',
    source: 'src/pages/LandingPage.tsx',
    title: 'Strawby - Controle de Refeições e Nutrição Diária',
    description:
      'Strawby é o app de nutrição para acompanhar calorias, macros e refeições do dia a dia. Simples, visual e consistente. Grátis e funciona como PWA.',
  },
  {
    path: '/faq',
    source: 'src/pages/FaqPage.tsx',
    title: 'Perguntas Frequentes - Strawby',
    description:
      'Tire suas dúvidas sobre o Strawby: como criar conta, registrar refeições, buscar alimentos, criar receitas e acompanhar metas de calorias e macros.',
  },
  {
    path: '/privacy',
    source: 'src/pages/PrivacyPage.tsx',
    title: 'Política de Privacidade - Strawby',
    description:
      'Saiba como o Strawby coleta, usa e protege seus dados pessoais. Sua privacidade é nossa prioridade.',
  },
  {
    path: '/terms',
    source: 'src/pages/TermsPage.tsx',
    title: 'Termos de Uso - Strawby',
    description:
      'Leia os termos de uso do Strawby. Entenda suas responsabilidades e os nossos compromissos ao usar a plataforma de nutrição.',
  },
]

/**
 * Lê VITE_SITE_URL e aborta se faltar — sem domínio, canonical e sitemap saem quebrados.
 * @param {Record<string, string>} env  Resultado de loadEnv do Vite.
 * @param {string} label                Prefixo usado na mensagem de erro.
 * @returns {string}                    URL sem barra final.
 */
export const resolveSiteUrl = (env, label) => {
  const siteUrl = (env.VITE_SITE_URL ?? '').replace(/\/$/, '')
  if (!siteUrl) {
    console.error(
      `[${label}] VITE_SITE_URL não definida. Defina em client/.env — sem ela o canonical\n` +
        `${' '.repeat(label.length + 3)}sai vazio e o Google trata as páginas como duplicatas.`,
    )
    process.exit(1)
  }
  return siteUrl
}
