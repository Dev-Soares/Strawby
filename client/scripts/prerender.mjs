/**
 * Gera um HTML estático por rota pública, a partir do dist/index.html do Vite.
 *
 * Por quê: o app é SPA e as meta tags vêm do react-helmet-async, ou seja, só existem
 * depois que o JS roda. WhatsApp, LinkedIn, Facebook, X e Slack não executam JS —
 * eles leem o HTML cru. Sem isto, /faq servia o index.html com o título, a descrição
 * e, pior, o canonical da home: cada página se anunciava como duplicata da raiz.
 *
 * Isto NÃO renderiza o React (não é SSR): o <div id="root"> continua vazio e a página
 * hidrata normalmente no navegador. O que muda é só o <head> do HTML servido.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { SEO_ROUTES, resolveSiteUrl } from './seo-routes.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production'
const siteUrl = resolveSiteUrl(loadEnv(mode, ROOT, 'VITE_'), 'prerender')

let template
try {
  template = readFileSync(resolve(DIST, 'index.html'), 'utf8')
} catch {
  console.error('[prerender] dist/index.html não encontrado. Rode o vite build antes.')
  process.exit(1)
}

/**
 * Escapa o que vai dentro de um atributo HTML.
 * @param {string} s
 * @returns {string}
 */
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Troca o content de uma meta, casando por name= ou property=.
 * @param {string} html   HTML completo.
 * @param {string} key    Valor de name= ou property= (ex: 'og:title').
 * @param {string} value  Novo content, ainda não escapado.
 * @returns {string}      HTML com a meta trocada, ou intacto se ela não existir.
 */
const setMeta = (html, key, value) => {
  const re = new RegExp(
    `(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`,
    'i',
  )
  if (!re.test(html)) {
    console.warn(`[prerender] meta "${key}" não encontrada no template — pulando`)
    return html
  }
  return html.replace(re, `$1${attr(value)}$2`)
}

let written = 0

for (const route of SEO_ROUTES) {
  // a raiz já sai correta do index.html, que o Vite monta com %VITE_SITE_URL%
  if (route.path === '/') continue

  const url = `${siteUrl}${route.path}`
  let html = template

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${attr(route.title)}</title>`)
  html = html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/i,
    `$1${attr(url)}$2`,
  )

  html = setMeta(html, 'description', route.description)
  html = setMeta(html, 'og:title', route.title)
  html = setMeta(html, 'og:description', route.description)
  html = setMeta(html, 'og:url', url)
  html = setMeta(html, 'twitter:title', route.title)
  html = setMeta(html, 'twitter:description', route.description)

  // Escreve nas duas formas porque hosts diferem em como resolvem uma URL sem barra
  // final: alguns procuram `faq/index.html`, outros `faq.html`. O canonical aponta
  // para `/faq` (sem barra), então as duas precisam existir — senão o host cai no
  // fallback de SPA e devolve o index da raiz, que é o bug que isto corrige.
  const slug = route.path.replace(/^\//, '')
  const dir = resolve(DIST, slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html)
  writeFileSync(resolve(DIST, `${slug}.html`), html)
  written++
  console.log(`[prerender] ${slug}/index.html + ${slug}.html`)
}

console.log(`[prerender] ${written} rotas escritas para ${siteUrl}`)
