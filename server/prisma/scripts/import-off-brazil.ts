/**
 * Importa produtos BRASILEIROS do dump completo do Open Food Facts (marcas
 * famosas e produtos industrializados pt-BR). Faz streaming do .csv.gz local
 * (NÃO usa a API — zero risco de derrubar o OFF por excesso de requisições).
 *
 * Pré-requisito: baixar o dump uma vez (1.3 GB) para prisma/data/:
 *   curl -L -C - --retry 5 -H "User-Agent: Strawby/1.0" \
 *     -o prisma/data/off-products.csv.gz \
 *     https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz
 *
 * O dump NÃO é versionado (.gitignore) — é regenerável e grande demais.
 *
 * Filtros: produto do Brasil + nome válido + nutrição plausível (não tudo zero).
 * Dedup: por código (ON CONFLICT) e por nome normalizado contra o que já existe.
 *
 * Uso:
 *   pnpm --filter server import:off            → insere
 *   pnpm --filter server import:off --dry-run  → conta, não insere
 */
import 'dotenv/config'
import { join } from 'path'
import { createReadStream } from 'fs'
import { createGunzip } from 'zlib'
import { createInterface } from 'readline'
import { randomUUID } from 'crypto'
import pg from 'pg'
import { cleanOffName } from './off-name.util'

const DRY_RUN = process.argv.includes('--dry-run')
const DUMP_PATH = join(process.cwd(), 'prisma', 'data', 'off-products.csv.gz')

const SOURCE = 'OFF'
const PRIORITY = 90
const BATCH_SIZE = 1000

// Colunas necessárias do CSV do OFF (TSV). Índices resolvidos pelo cabeçalho.
const NEEDED = [
  'code',
  'product_name',
  'brands',
  'countries_tags',
  'countries_en',
  'energy-kcal_100g',
  'proteins_100g',
  'carbohydrates_100g',
  'fat_100g',
  'fiber_100g',
  'sodium_100g',
  'salt_100g',
] as const
type Col = (typeof NEEDED)[number]

interface FoodEntry {
  name: string
  sourceId: string
  brands: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number | null
  sodium: number | null
}

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})

function num(val: string | undefined): number {
  if (!val) return 0
  const n = parseFloat(val.replace(',', '.'))
  return isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100
}

function isBrazil(tags: string, countriesEn: string): boolean {
  return /en:brazil/i.test(tags) || /brazil|brasil/i.test(countriesEn)
}

function isValidName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 120) return false
  if (!/[a-zA-ZÀ-ú]/.test(name)) return false // precisa ter letra
  if (/[%@#*|<>{}[\]\\]/.test(name)) return false
  if (/https?:\/\/|www\./i.test(name)) return false
  if (/�/.test(name)) return false // encoding quebrado (caractere de substituição)
  if (/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(name)) return false // emoji
  if (/(.)\1\1\1/.test(name)) return false // mesmo char 4x (gibberish/grito)
  if (name === name.toUpperCase() && name.length > 30) return false // grito longo
  if ((name.match(/\d/g)?.length ?? 0) > name.length / 2) return false // mais nº que letra
  return true
}

// Nutrição implausível: macros somam >105g/100g ou kcal vs macros muito divergente.
function isPlausible(cal: number, p: number, c: number, f: number): boolean {
  if (p + c + f > 105) return false
  if (cal > 950) return false
  const est = p * 4 + c * 4 + f * 9
  if (cal > 10 && est > 10 && Math.abs(cal - est) / cal > 0.45) return false
  return true
}

function normalizeForCompare(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchExistingNames(): Promise<Set<string>> {
  const { rows } = await pool.query<{ name: string }>('SELECT name FROM "Food"')
  return new Set(rows.map((r) => normalizeForCompare(r.name)))
}

async function insertBatch(batch: FoodEntry[]): Promise<number> {
  if (DRY_RUN || batch.length === 0) return batch.length
  const placeholders: string[] = []
  const values: unknown[] = []
  const now = new Date()
  batch.forEach((f, i) => {
    const b = i * 15
    placeholders.push(
      `($${b + 1},$${b + 2},$${b + 3},$${b + 4}::"FoodSource",$${b + 5},$${b + 6},$${b + 7},$${b + 8},$${b + 9},$${b + 10},$${b + 11},$${b + 12},$${b + 13},$${b + 14},$${b + 15})`,
    )
    values.push(
      randomUUID(), f.name, f.name, SOURCE, f.sourceId,
      `OFF:${f.sourceId}`, PRIORITY,
      f.calories, f.protein, f.carbs, f.fat, f.fiber, f.sodium,
      now, now,
    )
  })
  const { rowCount } = await pool.query(
    `INSERT INTO "Food"
       (id, name, "nameOriginal", source, "sourceId", "sourceUrl", priority,
        calories, protein, carbs, fat, fiber, sodium, "createdAt", "updatedAt")
     VALUES ${placeholders.join(',')}
     ON CONFLICT DO NOTHING`,
    values,
  )
  return rowCount ?? 0
}

async function main() {
  console.log(`Importando produtos BR do OFF${DRY_RUN ? ' [DRY RUN]' : ''}`)
  console.log(`Dump: ${DUMP_PATH}`)

  const existing = await fetchExistingNames()
  console.log(`Nomes já no banco: ${existing.size}`)

  const colIndex = new Map<Col, number>()
  let header = true
  let scanned = 0
  let brazil = 0
  let inserted = 0
  let kept = 0
  let buffer: FoodEntry[] = []
  const seenCodes = new Set<string>()

  const rl = createInterface({
    input: createReadStream(DUMP_PATH).pipe(createGunzip()),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    if (header) {
      const cols = line.split('\t')
      for (const c of NEEDED) {
        const idx = cols.indexOf(c)
        if (idx >= 0) colIndex.set(c, idx)
      }
      header = false
      const missing = NEEDED.filter((c) => !colIndex.has(c) && c !== 'salt_100g' && c !== 'countries_en')
      if (missing.length) throw new Error(`Colunas faltando no dump: ${missing.join(', ')}`)
      continue
    }

    scanned++
    const f = line.split('\t')
    const get = (c: Col): string => {
      const i = colIndex.get(c)
      return i === undefined ? '' : (f[i] ?? '')
    }

    if (!isBrazil(get('countries_tags'), get('countries_en'))) continue
    brazil++

    const code = get('code').trim()
    if (!code || seenCodes.has(code)) continue

    const name = cleanOffName(get('product_name'))
    if (!isValidName(name)) continue

    const calories = num(get('energy-kcal_100g'))
    const protein = num(get('proteins_100g'))
    const carbs = num(get('carbohydrates_100g'))
    const fat = num(get('fat_100g'))
    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
    if (!isPlausible(calories, protein, carbs, fat)) continue

    const key = normalizeForCompare(name)
    if (!key || existing.has(key)) continue

    seenCodes.add(code)
    existing.add(key)

    const fiber = num(get('fiber_100g'))
    // OFF dá sodium em g/100g; fallback: salt/2.5. Convertido para mg.
    let sodium = num(get('sodium_100g'))
    if (sodium === 0) sodium = num(get('salt_100g')) / 2.5
    kept++

    buffer.push({
      name,
      sourceId: code,
      brands: get('brands').trim() || null,
      calories,
      protein,
      carbs,
      fat,
      fiber: fiber > 0 ? fiber : null,
      sodium: sodium > 0 ? Math.round(sodium * 1000 * 100) / 100 : null,
    })

    if (buffer.length >= BATCH_SIZE) {
      inserted += await insertBatch(buffer)
      buffer = []
      if (scanned % 200000 < BATCH_SIZE) {
        console.log(`  ...${scanned} linhas | BR ${brazil} | aptos ${kept} | inseridos ${inserted}`)
      }
    }
  }

  if (buffer.length) inserted += await insertBatch(buffer)

  console.log(`\nLinhas no dump: ${scanned}`)
  console.log(`Produtos do Brasil: ${brazil}`)
  console.log(`Aptos (nome+nutrição+dedup): ${kept}`)
  console.log(`Inseridos: ${inserted}`)
}

main()
  .catch((e) => {
    console.error('Erro ao importar OFF:', e)
    process.exit(1)
  })
  .finally(() => pool.end())
