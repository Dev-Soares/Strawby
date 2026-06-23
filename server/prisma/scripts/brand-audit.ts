/**
 * Varredura de marcas: faz streaming do dump OFF e tabula as marcas dos
 * produtos brasileiros que passam pelos mesmos filtros do import (nome válido +
 * nutrição plausível). Mostra o que temos de marca no banco. Só relatório.
 *
 * Uso: pnpm --filter server tsx prisma/scripts/brand-audit.ts [--top=N]
 */
import 'dotenv/config'
import { join } from 'path'
import { createReadStream } from 'fs'
import { createGunzip } from 'zlib'
import { createInterface } from 'readline'
import { cleanOffName } from './off-name.util'

const DUMP_PATH = join(process.cwd(), 'prisma', 'data', 'off-products.csv.gz')
const TOP = Number(process.argv.find((a) => a.startsWith('--top='))?.split('=')[1] ?? 80)

const NEEDED = [
  'code', 'product_name', 'brands', 'countries_tags', 'countries_en',
  'energy-kcal_100g', 'proteins_100g', 'carbohydrates_100g', 'fat_100g',
] as const
type Col = (typeof NEEDED)[number]

function num(v: string | undefined): number {
  if (!v) return 0
  const n = parseFloat(v.replace(',', '.'))
  return isNaN(n) || n < 0 ? 0 : n
}
function isBrazil(tags: string, en: string): boolean {
  return /en:brazil/i.test(tags) || /brazil|brasil/i.test(en)
}
function isValidName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 120) return false
  if (!/[a-zA-ZÀ-ú]/.test(name)) return false
  if (/[%@#*|<>{}[\]\\]/.test(name)) return false
  return true
}
function isPlausible(cal: number, p: number, c: number, f: number): boolean {
  if (p + c + f > 105 || cal > 950) return false
  const est = p * 4 + c * 4 + f * 9
  if (cal > 10 && est > 10 && Math.abs(cal - est) / cal > 0.45) return false
  return true
}
// Normaliza marca: primeira da lista, minúscula, sem acento, trim.
function primaryBrand(raw: string): string | null {
  const first = raw.split(',')[0]?.trim()
  if (!first) return null
  return first.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

async function main() {
  const colIndex = new Map<Col, number>()
  let header = true
  let brazil = 0
  let kept = 0
  let noBrand = 0
  const tally = new Map<string, number>()

  const rl = createInterface({
    input: createReadStream(DUMP_PATH).pipe(createGunzip()),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const f = line.split('\t')
    if (header) {
      for (const c of NEEDED) {
        const i = f.indexOf(c)
        if (i >= 0) colIndex.set(c, i)
      }
      header = false
      continue
    }
    const get = (c: Col): string => {
      const i = colIndex.get(c)
      return i === undefined ? '' : (f[i] ?? '')
    }
    if (!isBrazil(get('countries_tags'), get('countries_en'))) continue
    brazil++
    const name = cleanOffName(get('product_name'))
    if (!isValidName(name)) continue
    const cal = num(get('energy-kcal_100g'))
    const p = num(get('proteins_100g'))
    const c = num(get('carbohydrates_100g'))
    const fa = num(get('fat_100g'))
    if (cal === 0 && p === 0 && c === 0 && fa === 0) continue
    if (!isPlausible(cal, p, c, fa)) continue

    kept++
    const brand = primaryBrand(get('brands'))
    if (!brand) {
      noBrand++
      continue
    }
    tally.set(brand, (tally.get(brand) ?? 0) + 1)
  }

  const sorted = [...tally.entries()].sort((a, b) => b[1] - a[1])
  console.log(`Produtos BR analisados: ${brazil}`)
  console.log(`Aptos (nome+nutrição): ${kept}`)
  console.log(`Sem marca: ${noBrand}`)
  console.log(`Marcas distintas: ${tally.size}\n`)
  console.log(`Top ${TOP} marcas (por nº de produtos):`)
  for (const [brand, count] of sorted.slice(0, TOP)) {
    console.log(`  ${String(count).padStart(5)} | ${brand}`)
  }
}

main().catch((e) => {
  console.error('Erro na varredura de marcas:', e)
  process.exit(1)
})
