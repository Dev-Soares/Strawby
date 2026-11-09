/**
 * Gera dist/sitemap.xml e injeta a linha Sitemap no dist/robots.txt.
 *
 * Escreve em dist/, nunca em public/: public/ é código-fonte versionado, e um script
 * que mexe lá faria toda build local sujar o git status — e commitaria o domínio do
 * ambiente de quem rodou o build por último.
 *
 * Roda DEPOIS do vite build, que já copiou public/ para dist/.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { SEO_ROUTES, resolveSiteUrl } from './seo-routes.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')

if (!existsSync(DIST)) {
  console.error('[sitemap] dist/ não encontrado. Rode o vite build antes.')
  process.exit(1)
}

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production'
const siteUrl = resolveSiteUrl(loadEnv(mode, ROOT, 'VITE_'), 'sitemap')

/**
 * Data do último commit que tocou o arquivo (YYYY-MM-DD).
 * @param {string} file  Caminho relativo à raiz do client.
 * @returns {string}
 */
const lastModified = (file) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (out) return out
  } catch {
    // sem git (CI com checkout raso, tarball) — cai no fallback
  }
  return new Date().toISOString().slice(0, 10)
}

// Só <loc> e <lastmod>: changefreq e priority são ignorados pelo Google desde 2023.
const body = SEO_ROUTES.map(
  ({ path, source }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastModified(source)}</lastmod>
  </url>`,
).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(resolve(DIST, 'sitemap.xml'), xml)
console.log(`[sitemap] ${SEO_ROUTES.length} rotas geradas para ${siteUrl}`)

// O robots.txt é escrito à mão em public/ (lista de bots de IA), mas a linha Sitemap
// carrega o domínio — é acrescentada aqui, na cópia que foi para dist/.
const robotsPath = resolve(DIST, 'robots.txt')
const robots = readFileSync(robotsPath, 'utf8')
const sitemapLine = `Sitemap: ${siteUrl}/sitemap.xml`
const patched = /^Sitemap:.*$/m.test(robots)
  ? robots.replace(/^Sitemap:.*$/m, sitemapLine)
  : `${robots.trimEnd()}\n\n${sitemapLine}\n`

if (patched !== robots) {
  writeFileSync(robotsPath, patched)
  console.log(`[robots]  ${sitemapLine}`)
}
